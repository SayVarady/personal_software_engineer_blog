<?php

namespace App\Services;

use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Yaml\Exception\ParseException;

/**
 * Parses and renders lightweight motion graphics, animated diagrams,
 * and visual explainers embedded inside markdown content.
 */
class MotionRenderer
{
    /**
     * Extracts motion code blocks and motion media references from raw markdown,
     * returning markdown with placeholder tokens and a map of token => rendered HTML.
     *
     * @return array{0: string, 1: array<string, string>}
     */
    public function extract(string $markdown): array
    {
        $placeholders = [];
        $counter = 0;

        // 1. Fenced blocks: ```motion[:type] ... ```
        $markdown = preg_replace_callback('/```motion(?::([a-z0-9_-]+))?\s*\n(.*?)\n```/s', function ($m) use (&$placeholders, &$counter) {
            $counter++;
            $token = "###MOTION_BLOCK_{$counter}###";
            $subType = strtolower(trim($m[1] ?? ''));
            $content = $m[2];

            $placeholders[$token] = $this->renderFencedBlock($subType, $content, $counter);

            return $token;
        }, $markdown);

        // 2. Standard markdown images with motion extensions: ![caption](/path/to/file.(lottie|json|webm|mp4))
        $markdown = preg_replace_callback('/!\[([^\]]*)\]\(([^)]+\.(lottie|json|webm|mp4)(?:\?[^)]*)?)\)/i', function ($m) use (&$placeholders, &$counter) {
            $counter++;
            $token = "###MOTION_BLOCK_{$counter}###";
            $caption = trim($m[1]);
            $src = trim($m[2]);
            $ext = strtolower($m[3]);

            $type = in_array($ext, ['webm', 'mp4'], true) ? 'video' : ($ext === 'lottie' ? 'dotlottie' : 'lottie');
            $placeholders[$token] = $this->renderCard([
                'type' => $type,
                'src' => $src,
                'caption' => $caption,
                'autoplay' => true,
                'loop' => true,
                'controls' => true,
            ], $counter);

            return $token;
        }, $markdown);

        return [$markdown, $placeholders];
    }

    /**
     * Restores placeholder tokens into the final rendered HTML.
     */
    public function restore(string $html, array $placeholders): string
    {
        foreach ($placeholders as $token => $rendered) {
            $quoted = preg_quote($token, '/');
            $pattern = '/<p>\s*' . $quoted . '\s*<\/p>|' . $quoted . '/';
            $html = (string) preg_replace($pattern, $rendered, $html);
        }

        return $html;
    }

    protected function renderFencedBlock(string $subType, string $raw, int $id): string
    {
        // Handle raw SVG block: ```motion:svg
        if ($subType === 'svg') {
            return $this->renderSvgCard($raw, $id);
        }

        // Parse YAML configuration
        $config = [];
        try {
            $config = Yaml::parse($raw) ?? [];
        } catch (ParseException $e) {
            return '<div class="p-4 my-6 rounded border border-red-500 text-xs font-mono text-red-500">Error parsing motion block YAML: ' . htmlspecialchars($e->getMessage()) . '</div>';
        }

        $type = strtolower($config['type'] ?? $subType);

        if ($type === 'diagram' || $type === 'transaction' || $type === 'transaction-lifecycle' || $subType === 'diagram') {
            return $this->renderTransactionDiagramCard($config, $id);
        }

        if ($subType === 'steps' || isset($config['steps'])) {
            return $this->renderStepsCard($config, $id);
        }

        if ($subType) {
            $config['type'] = $subType;
        }

        return $this->renderCard($config, $id);
    }

    /**
     * Renders a Lottie JSON, DotLottie, Video, or generic motion card.
     */
    protected function renderCard(array $config, int $id): string
    {
        $src = htmlspecialchars($config['src'] ?? '', ENT_QUOTES, 'UTF-8');
        $caption = htmlspecialchars($config['caption'] ?? '', ENT_QUOTES, 'UTF-8');
        $title = htmlspecialchars($config['title'] ?? 'Visual Demonstration', ENT_QUOTES, 'UTF-8');
        $maxHeight = htmlspecialchars($config['maxHeight'] ?? '360px', ENT_QUOTES, 'UTF-8');
        $autoplay = ($config['autoplay'] ?? true) ? 'autoplay' : '';
        $loop = ($config['loop'] ?? true) ? 'loop' : '';
        $type = strtolower($config['type'] ?? '');

        if (! $type) {
            $path = parse_url($src, PHP_URL_PATH) ?? '';
            $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
            if (in_array($ext, ['mp4', 'webm'], true)) {
                $type = 'video';
            } elseif ($ext === 'lottie') {
                $type = 'dotlottie';
            } else {
                $type = 'lottie'; // standard JSON
            }
        }

        $captionHtml = '';
        if ($caption !== '') {
            $captionHtml = <<<HTML
            <figcaption class="motion-card-caption">
                <i class="fa-solid fa-circle-info text-xs mr-2" style="color:var(--primary)"></i>
                <span>{$caption}</span>
            </figcaption>
            HTML;
        }

        $controlsHtml = <<<HTML
        <div class="motion-controls flex items-center gap-1.5">
            <button type="button" class="motion-btn" data-action="toggle-play" title="Play / Pause" aria-label="Toggle Play">
                <i class="fa-solid fa-pause text-xs"></i>
            </button>
            <button type="button" class="motion-btn" data-action="restart" title="Restart animation" aria-label="Restart">
                <i class="fa-solid fa-rotate-left text-xs"></i>
            </button>
            <button type="button" class="motion-btn text-[11px] font-mono font-semibold" data-action="speed" title="Playback speed" aria-label="Toggle Speed">
                1x
            </button>
        </div>
        HTML;

        if ($type === 'video') {
            $stageHtml = <<<HTML
            <div class="motion-stage flex items-center justify-center p-3 sm:p-5">
                <video src="{$src}" style="width: 100%; max-height: {$maxHeight}; border-radius: 0.5rem;" playsinline muted {$autoplay} {$loop}></video>
            </div>
            HTML;
        } elseif ($type === 'dotlottie') {
            $stageHtml = <<<HTML
            <div class="motion-stage flex items-center justify-center p-4 sm:p-6">
                <dotlottie-player
                    src="{$src}"
                    background="transparent"
                    speed="1"
                    style="width: 100%; max-height: {$maxHeight};"
                    {$autoplay}
                    {$loop}>
                </dotlottie-player>
            </div>
            HTML;
        } else {
            // Universal Lottie JSON player
            $stageHtml = <<<HTML
            <div class="motion-stage flex items-center justify-center p-4 sm:p-6">
                <lottie-player
                    src="{$src}"
                    background="transparent"
                    speed="1"
                    style="width: 100%; max-height: {$maxHeight};"
                    {$autoplay}
                    {$loop}>
                </lottie-player>
            </div>
            HTML;
        }

        return <<<HTML
        <figure class="motion-card my-8" id="motion-card-{$id}" data-motion-type="{$type}">
            <div class="motion-card-header">
                <div class="flex items-center gap-2">
                    <span class="motion-badge">
                        <i class="fa-solid fa-play text-[10px] mr-1.5" style="color:var(--primary)"></i>
                        {$title}
                    </span>
                    <span class="text-xs" style="color:var(--muted)">• Motion Explainer</span>
                </div>
                {$controlsHtml}
            </div>
            {$stageHtml}
            {$captionHtml}
        </figure>
        HTML;
    }

    /**
     * Renders an interactive step-by-step visual demonstration card with an animated pipeline.
     */
    protected function renderStepsCard(array $config, int $id): string
    {
        $title = htmlspecialchars($config['title'] ?? 'Visual Walkthrough', ENT_QUOTES, 'UTF-8');
        $caption = htmlspecialchars($config['caption'] ?? '', ENT_QUOTES, 'UTF-8');
        $steps = $config['steps'] ?? [];

        if (empty($steps) || ! is_array($steps)) {
            return '';
        }

        $captionHtml = '';
        if ($caption !== '') {
            $captionHtml = <<<HTML
            <figcaption class="motion-card-caption">
                <i class="fa-solid fa-circle-info text-xs mr-2" style="color:var(--primary)"></i>
                <span>{$caption}</span>
            </figcaption>
            HTML;
        }

        $tabsHtml = '<div class="motion-steps-nav flex items-center gap-2 overflow-x-auto p-2" role="tablist">';
        $pipelineNodesHtml = '';
        $panelsHtml = '<div class="motion-steps-panels relative p-4 sm:p-6">';
        $stepCount = count($steps);

        foreach ($steps as $idx => $step) {
            $isActive = $idx === 0;
            $activeClass = $isActive ? 'active' : '';
            $stageLabel = htmlspecialchars($step['stage'] ?? ('Step ' . ($idx + 1)), ENT_QUOTES, 'UTF-8');
            $stepTitle = htmlspecialchars($step['title'] ?? '', ENT_QUOTES, 'UTF-8');
            $stepDesc = htmlspecialchars($step['desc'] ?? '', ENT_QUOTES, 'UTF-8');
            $tag = htmlspecialchars($step['tag'] ?? '', ENT_QUOTES, 'UTF-8');

            $tabsHtml .= <<<HTML
            <button type="button" class="motion-step-tab {$activeClass}" data-step="{$idx}" role="tab" aria-selected="{$isActive}">
                <span class="step-num">{$stageLabel}</span>
            </button>
            HTML;

            $nodeNum = $idx + 1;
            $pipelineNodesHtml .= <<<HTML
            <div class="motion-pipeline-node {$activeClass}" data-step-node="{$idx}">
                <div class="motion-node-circle">{$nodeNum}</div>
                <div class="motion-node-label hidden sm:block">{$stageLabel}</div>
            </div>
            HTML;

            $tagHtml = $tag !== '' ? "<span class=\"motion-step-tag\">{$tag}</span>" : '';

            $hiddenStyle = $isActive ? '' : 'style="display:none;"';
            $panelsHtml .= <<<HTML
            <div class="motion-step-panel {$activeClass}" data-step-panel="{$idx}" {$hiddenStyle}>
                <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h4 class="text-base font-semibold m-0" style="color:var(--fg)">{$stepTitle}</h4>
                    {$tagHtml}
                </div>
                <p class="text-sm m-0 leading-relaxed" style="color:var(--fg2)">{$stepDesc}</p>
            </div>
            HTML;
        }

        $tabsHtml .= '</div>';
        $panelsHtml .= '</div>';

        $visualPipelineHtml = <<<HTML
        <div class="motion-steps-visual px-6 pt-6 pb-2" style="background:color-mix(in srgb, var(--bg2) 40%, var(--card))">
            <div class="motion-pipeline relative mb-3">
                <div class="motion-pipeline-track">
                    <div class="motion-pipeline-progress" id="motion-progress-{$id}" style="width: 0%;"></div>
                    <div class="motion-pipeline-beacon" id="motion-beacon-{$id}" style="left: 0%;"></div>
                </div>
                <div class="motion-pipeline-nodes flex justify-between relative z-10">
                    {$pipelineNodesHtml}
                </div>
            </div>
        </div>
        HTML;

        return <<<HTML
        <figure class="motion-card motion-steps-card my-8" id="motion-card-{$id}" data-motion-type="steps" data-total-steps="{$stepCount}">
            <div class="motion-card-header">
                <div class="flex items-center gap-2">
                    <span class="motion-badge">
                        <i class="fa-solid fa-diagram-project text-xs mr-1.5" style="color:var(--primary)"></i>
                        {$title}
                    </span>
                    <span class="text-xs" style="color:var(--muted)">• Interactive Concept Flow</span>
                </div>
                <div class="motion-controls flex items-center gap-1.5">
                    <button type="button" class="motion-btn" data-action="prev-step" title="Previous Step" aria-label="Previous Step">
                        <i class="fa-solid fa-chevron-left text-xs"></i>
                    </button>
                    <button type="button" class="motion-btn" data-action="toggle-steps-autoplay" title="Auto-play steps" aria-label="Auto-play">
                        <i class="fa-solid fa-play text-xs mr-1"></i>Play
                    </button>
                    <button type="button" class="motion-btn" data-action="next-step" title="Next Step" aria-label="Next Step">
                        <i class="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                </div>
            </div>
            {$visualPipelineHtml}
            {$tabsHtml}
            {$panelsHtml}
            {$captionHtml}
        </figure>
        HTML;
    }

    /**
     * Renders a dedicated animated visual diagram for Database Transaction Lifecycle (RAM vs DISK).
     */
    protected function renderTransactionDiagramCard(array $config, int $id): string
    {
        $title = htmlspecialchars($config['title'] ?? 'Transaction Lifespan: RAM vs Disk', ENT_QUOTES, 'UTF-8');
        $caption = htmlspecialchars($config['caption'] ?? 'Figure 1: Queries modify fast in-memory buffers in RAM. COMMIT flushes changes atomically to physical Disk.', ENT_QUOTES, 'UTF-8');

        $captionHtml = '';
        if ($caption !== '') {
            $captionHtml = <<<HTML
            <figcaption class="motion-card-caption">
                <i class="fa-solid fa-circle-info text-xs mr-2" style="color:var(--primary)"></i>
                <span>{$caption}</span>
            </figcaption>
            HTML;
        }

        return <<<HTML
        <figure class="motion-card motion-diagram-card my-8" id="motion-card-{$id}" data-motion-type="diagram" data-diagram="transaction-lifecycle">
            <div class="motion-card-header">
                <div class="flex items-center gap-2">
                    <span class="motion-badge">
                        <i class="fa-solid fa-wand-magic-sparkles text-xs mr-1.5" style="color:var(--primary)"></i>
                        {$title}
                    </span>
                    <span class="text-xs" style="color:var(--muted)">• Interactive Architecture</span>
                </div>
                <div class="motion-controls flex items-center gap-1.5">
                    <button type="button" class="motion-btn" data-action="tx-autoplay" title="Auto-play lifecycle">
                        <i class="fa-solid fa-play text-xs mr-1"></i>Auto-Play
                    </button>
                    <button type="button" class="motion-btn" data-action="tx-commit" title="Simulate COMMIT">
                        <i class="fa-solid fa-check text-xs mr-1" style="color:var(--success)"></i>Commit
                    </button>
                    <button type="button" class="motion-btn" data-action="tx-rollback" title="Simulate ROLLBACK">
                        <i class="fa-solid fa-rotate-left text-xs mr-1" style="color:var(--danger)"></i>Rollback
                    </button>
                    <button type="button" class="motion-btn" data-action="tx-reset" title="Reset state">
                        <i class="fa-solid fa-arrows-rotate text-xs"></i>
                    </button>
                </div>
            </div>

            <div class="motion-stage p-4 sm:p-6" style="background:color-mix(in srgb, var(--bg2) 30%, var(--card))">
                <div class="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                    <!-- RAM Buffer Box -->
                    <div class="md:col-span-3 tx-block tx-ram p-4 rounded-xl border transition-all duration-300" id="tx-ram-box-{$id}" style="background:var(--card);border-color:var(--border)">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2">
                                <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:var(--primary-pale);color:var(--primary)">
                                    <i class="fa-solid fa-memory text-xs"></i>
                                </div>
                                <div>
                                    <div class="text-xs font-bold" style="color:var(--fg)">RAM Buffer Cache</div>
                                    <div class="text-[10px]" style="color:var(--muted)">Fast • In-Memory Staging</div>
                                </div>
                            </div>
                            <span class="tx-ram-badge text-[10px] font-mono font-bold px-2 py-0.5 rounded transition-all" id="tx-ram-badge-{$id}" style="background:var(--primary-pale);color:var(--primary)">IDLE</span>
                        </div>
                        <div class="space-y-2 font-mono text-xs">
                            <div class="tx-mem-row p-2 rounded flex items-center justify-between transition-all" id="tx-ram-row-bal-{$id}" style="background:var(--bg2)">
                                <span style="color:var(--muted)">User #1 Balance:</span>
                                <span class="font-bold tx-val" id="tx-ram-val-bal-{$id}" style="color:var(--fg)">$100</span>
                            </div>
                            <div class="tx-mem-row p-2 rounded flex items-center justify-between transition-all" id="tx-ram-row-stock-{$id}" style="background:var(--bg2)">
                                <span style="color:var(--muted)">Prod #99 Stock:</span>
                                <span class="font-bold tx-val" id="tx-ram-val-stock-{$id}" style="color:var(--fg)">99</span>
                            </div>
                        </div>
                        <div class="tx-ram-hint text-[11px] mt-3 flex items-center" style="color:var(--muted)">
                            <i class="fa-solid fa-circle-dot text-[9px] mr-1.5" id="tx-ram-dot-{$id}" style="color:var(--primary)"></i>
                            <span id="tx-ram-hint-text-{$id}">Transaction not started.</span>
                        </div>
                    </div>

                    <!-- Flush Bus Connector with Moving Animation Packet -->
                    <div class="md:col-span-1 flex flex-col items-center justify-center py-2">
                        <div class="tx-bus-container relative w-full flex items-center justify-center">
                            <svg viewBox="0 0 100 36" class="w-full h-9 overflow-visible">
                                <line x1="10" y1="18" x2="90" y2="18" stroke="var(--border)" stroke-width="3" stroke-dasharray="4,4" class="tx-bus-track" />
                                <circle cx="10" cy="18" r="6" fill="var(--primary)" class="tx-packet-dot" id="tx-packet-{$id}" style="opacity: 0; transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s;" />
                                <polygon points="84,13 94,18 84,23" fill="var(--border)" />
                            </svg>
                        </div>
                        <div class="text-[10px] uppercase font-mono tracking-wider font-semibold mt-1" style="color:var(--muted)" id="tx-bus-label-{$id}">Flush Bus</div>
                    </div>

                    <!-- Persistent Disk Storage Box -->
                    <div class="md:col-span-3 tx-block tx-disk p-4 rounded-xl border transition-all duration-300" id="tx-disk-box-{$id}" style="background:var(--card);border-color:var(--border)">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2">
                                <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:color-mix(in srgb, var(--accent) 15%, transparent);color:var(--accent)">
                                    <i class="fa-solid fa-hard-drive text-xs"></i>
                                </div>
                                <div>
                                    <div class="text-xs font-bold" style="color:var(--fg)">Physical DISK</div>
                                    <div class="text-[10px]" style="color:var(--muted)">Durable • Persistent Tables</div>
                                </div>
                            </div>
                            <span class="tx-disk-badge text-[10px] font-mono font-bold px-2 py-0.5 rounded transition-all" id="tx-disk-badge-{$id}" style="background:var(--bg2);color:var(--muted)">UNTOUCHED</span>
                        </div>
                        <div class="space-y-2 font-mono text-xs">
                            <div class="tx-disk-row p-2 rounded flex items-center justify-between transition-all" id="tx-disk-row-bal-{$id}" style="background:var(--bg2)">
                                <span style="color:var(--muted)">Table: users #1:</span>
                                <span class="font-bold tx-disk-val" id="tx-disk-val-bal-{$id}" style="color:var(--fg)">bal: $100</span>
                            </div>
                            <div class="tx-disk-row p-2 rounded flex items-center justify-between transition-all" id="tx-disk-row-stock-{$id}" style="background:var(--bg2)">
                                <span style="color:var(--muted)">Table: products #99:</span>
                                <span class="font-bold tx-disk-val" id="tx-disk-val-stock-{$id}" style="color:var(--fg)">stock: 99</span>
                            </div>
                        </div>
                        <div class="tx-disk-hint text-[11px] mt-3 flex items-center" style="color:var(--muted)">
                            <i class="fa-solid fa-shield text-[9px] mr-1.5" style="color:var(--primary)"></i>
                            <span id="tx-disk-status-{$id}">Disk safe from mid-transaction errors.</span>
                        </div>
                    </div>
                </div>

                <!-- Simulation Stepper Bar -->
                <div class="tx-stepper-bar mt-4 pt-3 flex items-center justify-between border-t flex-wrap gap-2" style="border-color:var(--border)">
                    <div class="flex items-center gap-1.5 text-xs font-medium" id="tx-step-pills-{$id}">
                        <button type="button" class="tx-step-pill px-2.5 py-1 rounded-md text-xs font-semibold active" data-tx-step="1" style="background:var(--primary);color:#fff">1. BEGIN</button>
                        <button type="button" class="tx-step-pill px-2.5 py-1 rounded-md text-xs font-semibold" data-tx-step="2" style="background:var(--bg2);color:var(--fg)">2. UPDATE Queries</button>
                        <button type="button" class="tx-step-pill px-2.5 py-1 rounded-md text-xs font-semibold" data-tx-step="3" style="background:var(--bg2);color:var(--fg)">3. COMMIT</button>
                    </div>
                    <div class="text-xs font-mono" id="tx-stage-status-{$id}" style="color:var(--primary)">
                        Ready: Click buttons or Auto-Play to see motion
                    </div>
                </div>
            </div>

            {$captionHtml}
        </figure>
        HTML;
    }

    /**
     * Renders a custom inline SVG motion graphic.
     */
    protected function renderSvgCard(string $svgContent, int $id): string
    {
        return <<<HTML
        <figure class="motion-card my-8" id="motion-card-{$id}" data-motion-type="svg">
            <div class="motion-card-header">
                <div class="flex items-center gap-2">
                    <span class="motion-badge">
                        <i class="fa-solid fa-vector-square text-xs mr-1.5" style="color:var(--primary)"></i>
                        Visual Diagram
                    </span>
                    <span class="text-xs" style="color:var(--muted)">• Animated SVG</span>
                </div>
            </div>
            <div class="motion-stage p-4 sm:p-6 flex items-center justify-center">
                {$svgContent}
            </div>
        </figure>
        HTML;
    }
}
