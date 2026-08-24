<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use League\CommonMark\CommonMarkConverter;
use Symfony\Component\Yaml\Yaml;

/**
 * Reads series/chapter content from content/series/**.
 * Frontmatter + directory scans are cached; the cache key is fingerprinted
 * from file mtimes, so editing a .md/.yaml file auto-invalidates its cache
 * entry without needing `artisan cache:clear`.
 */
class ContentRepository
{
    protected string $basePath;

    protected CommonMarkConverter $markdown;

    public function __construct()
    {
        $this->basePath = base_path('content/series');
        $this->markdown = new CommonMarkConverter([
            'html_input' => 'strip',
            'allow_unsafe_links' => false,
        ]);
    }

    /** All series with chapter metadata (no rendered bodies), sorted by `order`. */
    public function allSeries(): array
    {
        $fp = $this->fingerprint($this->basePath);

        return Cache::remember("content:series:all:{$fp}", now()->addDays(30), function () {
            $series = [];

            foreach (glob("{$this->basePath}/*", GLOB_ONLYDIR) ?: [] as $dir) {
                $id = basename($dir);
                $metaFile = "{$dir}/meta.yaml";
                if (! is_file($metaFile)) {
                    continue;
                }

                $meta = Yaml::parseFile($metaFile);
                $chapters = [];

                foreach (glob("{$dir}/*.md") ?: [] as $chapterFile) {
                    [$front, ] = $this->splitFrontmatter(file_get_contents($chapterFile));
                    $front['id'] = pathinfo($chapterFile, PATHINFO_FILENAME);
                    $chapters[] = $front;
                }

                usort($chapters, fn ($a, $b) => ($a['order'] ?? 0) <=> ($b['order'] ?? 0));

                $series[] = [
                    'id' => $id,
                    'title' => $meta['title'],
                    'icon' => $meta['icon'],
                    'color' => $meta['color'],
                    'desc' => $meta['desc'],
                    'prereqs' => $meta['prereqs'] ?? [],
                    'order' => $meta['order'] ?? 0,
                    'chapters' => $chapters,
                ];
            }

            usort($series, fn ($a, $b) => $a['order'] <=> $b['order']);

            return $series;
        });
    }

    public function series(string $seriesId): ?array
    {
        foreach ($this->allSeries() as $s) {
            if ($s['id'] === $seriesId) {
                return $s;
            }
        }

        return null;
    }

    public function chapterMeta(string $seriesId, string $chapterId): ?array
    {
        $series = $this->series($seriesId);
        if (! $series) {
            return null;
        }

        foreach ($series['chapters'] as $c) {
            if ($c['id'] === $chapterId) {
                return $c;
            }
        }

        return null;
    }

    /** Chapter with rendered HTML body + table of contents, cached per file. */
    public function chapter(string $seriesId, string $chapterId): ?array
    {
        $file = "{$this->basePath}/{$seriesId}/{$chapterId}.md";
        if (! is_file($file)) {
            return null;
        }

        $fp = filemtime($file);

        return Cache::remember("content:chapter:{$seriesId}:{$chapterId}:{$fp}", now()->addDays(30), function () use ($file, $chapterId) {
            [$front, $body] = $this->splitFrontmatter(file_get_contents($file));
            $html = $this->markdown->convert($body)->getContent();
            [$html, $toc] = $this->addHeadingIds($html);

            $front['id'] = $chapterId;
            $front['html'] = $html;
            $front['toc'] = $toc;

            return $front;
        });
    }

    /** Most recently dated chapters across all series (frontmatter `date:` field), newest first. */
    public function newChapters(int $limit = 3): array
    {
        $flat = [];

        foreach ($this->allSeries() as $series) {
            foreach ($series['chapters'] as $chapter) {
                if (empty($chapter['date'])) {
                    continue;
                }

                $flat[] = [
                    'seriesId' => $series['id'],
                    'seriesTitle' => $series['title'],
                    'seriesColor' => $series['color'],
                    'seriesIcon' => $series['icon'],
                    'chId' => $chapter['id'],
                    'title' => $chapter['title'],
                    'date' => $chapter['date'],
                ];
            }
        }

        usort($flat, fn ($a, $b) => strcmp($b['date'], $a['date']));

        return array_slice($flat, 0, $limit);
    }

    /** @return array{0: array<string,mixed>, 1: string} [frontmatter, body] */
    protected function splitFrontmatter(string $raw): array
    {
        if (! str_starts_with($raw, "---\n")) {
            return [[], $raw];
        }

        $end = strpos($raw, "\n---\n", 4);
        if ($end === false) {
            return [[], $raw];
        }

        $yaml = substr($raw, 4, $end - 4);
        $body = substr($raw, $end + 5);

        return [Yaml::parse($yaml) ?? [], $body];
    }

    /** Adds slug ids to <h2> tags and returns [html, toc[{id,label}]]. */
    protected function addHeadingIds(string $html): array
    {
        $toc = [];

        $html = preg_replace_callback('/<h2>(.*?)<\/h2>/s', function ($m) use (&$toc) {
            $text = trim(html_entity_decode(strip_tags($m[1]), ENT_QUOTES));
            $id = Str::slug($text);
            $toc[] = ['id' => $id, 'label' => $text];

            return "<h2 id=\"{$id}\">{$m[1]}</h2>";
        }, $html);

        return [$html, $toc];
    }

    protected function fingerprint(string $dir): string
    {
        $latest = 0;
        foreach (glob("{$dir}/*/*") ?: [] as $file) {
            $latest = max($latest, filemtime($file));
        }

        return (string) $latest;
    }
}
