<?php

namespace App\Http\Controllers;

use App\Services\ContentRepository;
use Symfony\Component\HttpFoundation\Response;

class BlogController extends Controller
{
    public function __construct(protected ContentRepository $content)
    {
    }

    public function home(): Response
    {
        return response()
            ->view('blog.home', [
                'series' => $this->content->allSeries(),
                'newChapters' => $this->content->newChapters(3),
            ])
            ->setMaxAge(300)
            ->header('Vary', 'Accept-Encoding');
    }

    public function series(string $series): Response
    {
        $allSeries = $this->content->allSeries();
        $current = $this->content->series($series);
        abort_if(! $current, 404);

        return response()
            ->view('blog.series', [
                'allSeries' => $allSeries,
                'series' => $current,
                'graph' => $this->buildPrereqGraph($allSeries, $current['id']),
            ])
            ->setMaxAge(300)
            ->header('Vary', 'Accept-Encoding');
    }

    public function chapter(string $series, string $chapter): Response
    {
        $currentSeries = $this->content->series($series);
        abort_if(! $currentSeries, 404);

        $currentChapter = $this->content->chapter($series, $chapter);
        abort_if(! $currentChapter, 404);

        $chapters = $currentSeries['chapters'];
        $idx = collect($chapters)->search(fn ($c) => $c['id'] === $chapter);

        return response()
            ->view('blog.chapter', [
                'series' => $currentSeries,
                'chapter' => $currentChapter,
                'index' => $idx,
                'prevChapter' => $idx > 0 ? $chapters[$idx - 1] : null,
                'nextChapter' => $idx < count($chapters) - 1 ? $chapters[$idx + 1] : null,
                'playgroundCode' => $chapter === 'ca1' ? $this->ca1PlaygroundCode() : null,
            ])
            ->setMaxAge(300)
            ->header('Vary', 'Accept-Encoding');
    }

    /**
     * Fixed [col, row] position per series id, laid out left-to-right by
     * prereq depth. Any series id not listed here falls back to a spare
     * slot so the graph never breaks — it just won't be positioned nicely.
     */
    protected function graphLayout(): array
    {
        return [
            'networking' => [0, 1],
            'fundamentals' => [1, 1],
            'testing' => [2, 1],
            'security' => [2, 2],
            'clean-arch' => [3, 1],
            'api-design' => [4, 0],
            'containers' => [4, 1],
            'db-internals' => [4, 2],
            'shipping-ops' => [5, 1],
            'system-design' => [6, 1],
        ];
    }

    protected function buildPrereqGraph(array $allSeries, string $currentId): array
    {
        $layout = $this->graphLayout();
        $fallbackCol = count($layout);

        $nodes = [];
        foreach (array_values($allSeries) as $i => $s) {
            [$col, $row] = $layout[$s['id']] ?? [$fallbackCol + $i, 1];
            $nodes[] = [
                'id' => $s['id'],
                'x' => 80 + $col * 130,
                'y' => 70 + $row * 130,
                'r' => 32,
                'label' => implode(' ', array_slice(explode(' ', $s['title']), 0, 2)),
                'color' => $s['color'],
                'current' => $s['id'] === $currentId,
            ];
        }

        $byId = collect($nodes)->keyBy('id');
        $edges = [];
        foreach ($allSeries as $s) {
            foreach ($s['prereqs'] as $prereq) {
                $a = $byId[$prereq];
                $b = $byId[$s['id']];
                $edges[] = $this->edgeGeometry($a, $b, $a['id'] === $currentId || $b['id'] === $currentId);
            }
        }

        return ['nodes' => $nodes, 'edges' => $edges];
    }

    protected function ca1PlaygroundCode(): string
    {
        return <<<'JS'
// Dependency Inversion in action
class MockUserRepo {
  findById(id) {
    return { id, name: 'Test User', role: 'admin' };
  }
}

class PostgresUserRepo {
  findById(id) {
    return { id, name: 'Real User', role: 'editor' };
  }
}

class UserService {
  constructor(repository) {
    this.repo = repository;
  }
  getUser(id) {
    return this.repo.findById(id);
  }
}

// Test environment — inject a mock
const testSvc = new UserService(new MockUserRepo());
console.log('Test env:', testSvc.getUser(42));

// Production — inject real DB
const prodSvc = new UserService(new PostgresUserRepo());
console.log('Production:', prodSvc.getUser(42));

console.log('Same service, different data sources.');
console.log('UserService never knows the difference.');
JS;
    }

    protected function edgeGeometry(array $a, array $b, bool $highlighted): array
    {
        $dx = $b['x'] - $a['x'];
        $dy = $b['y'] - $a['y'];
        $dist = sqrt($dx ** 2 + $dy ** 2) ?: 1;
        $nx = $dx / $dist;
        $ny = $dy / $dist;

        $x1 = $a['x'] + $nx * $a['r'];
        $y1 = $a['y'] + $ny * $a['r'];
        $x2 = $b['x'] - $nx * $b['r'];
        $y2 = $b['y'] - $ny * $b['r'];
        $mx = ($x1 + $x2) / 2;
        $my = ($y1 + $y2) / 2;
        $cx = $mx + $ny * 20;
        $cy = $my - $nx * 20;

        $ax = $x2 - $nx * 8;
        $ay = $y2 - $ny * 8;
        $px = -$ny * 4;
        $py = $nx * 4;

        return [
            'path' => "M{$x1},{$y1} Q{$cx},{$cy} {$x2},{$y2}",
            'arrow' => "{$x2},{$y2} " . ($ax + $px) . ',' . ($ay + $py) . ' ' . ($ax - $px) . ',' . ($ay - $py),
            'highlighted' => $highlighted,
        ];
    }
}
