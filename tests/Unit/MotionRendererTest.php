<?php

namespace Tests\Unit;

use App\Services\MotionRenderer;
use League\CommonMark\CommonMarkConverter;
use PHPUnit\Framework\TestCase;

class MotionRendererTest extends TestCase
{
    protected MotionRenderer $renderer;
    protected CommonMarkConverter $converter;

    protected function setUp(): void
    {
        parent::setUp();
        $this->renderer = new MotionRenderer();
        $this->converter = new CommonMarkConverter([
            'html_input' => 'strip',
            'allow_unsafe_links' => false,
        ]);
    }

    public function test_it_extracts_and_renders_motion_lottie_blocks(): void
    {
        $markdown = <<<'MD'
# Hello World

```motion
src: /animations/test.json
caption: "Sample visual explanation"
autoplay: true
loop: true
```

After block
MD;

        [$processedMarkdown, $placeholders] = $this->renderer->extract($markdown);

        $this->assertCount(1, $placeholders);
        $this->assertStringContainsString('###MOTION_BLOCK_1###', $processedMarkdown);

        $html = $this->converter->convert($processedMarkdown)->getContent();
        $finalHtml = $this->renderer->restore($html, $placeholders);

        $this->assertStringContainsString('<figure class="motion-card', $finalHtml);
        $this->assertStringContainsString('<lottie-player', $finalHtml);
        $this->assertStringContainsString('src="/animations/test.json"', $finalHtml);
        $this->assertStringContainsString('Sample visual explanation', $finalHtml);
    }

    public function test_it_extracts_and_renders_interactive_steps(): void
    {
        $markdown = <<<'MD'
```motion:steps
title: "Transaction State"
steps:
  - stage: "BEGIN"
    title: "Start"
    desc: "Starts in RAM"
    tag: "Memory"
  - stage: "COMMIT"
    title: "Finish"
    desc: "Flushes to Disk"
    tag: "Storage"
```
MD;

        [$processedMarkdown, $placeholders] = $this->renderer->extract($markdown);
        $this->assertCount(1, $placeholders);

        $html = $this->converter->convert($processedMarkdown)->getContent();
        $finalHtml = $this->renderer->restore($html, $placeholders);

        $this->assertStringContainsString('data-motion-type="steps"', $finalHtml);
        $this->assertStringContainsString('Transaction State', $finalHtml);
        $this->assertStringContainsString('Starts in RAM', $finalHtml);
        $this->assertStringContainsString('Flushes to Disk', $finalHtml);
        $this->assertStringContainsString('motion-step-tab', $finalHtml);
    }

    public function test_it_converts_markdown_motion_images(): void
    {
        $markdown = "Check this out:\n\n![Packet Flow](/animations/networking.lottie)\n\nEnd text";

        [$processedMarkdown, $placeholders] = $this->renderer->extract($markdown);
        $this->assertCount(1, $placeholders);

        $html = $this->converter->convert($processedMarkdown)->getContent();
        $finalHtml = $this->renderer->restore($html, $placeholders);

        $this->assertStringContainsString('<dotlottie-player', $finalHtml);
        $this->assertStringContainsString('src="/animations/networking.lottie"', $finalHtml);
        $this->assertStringContainsString('Packet Flow', $finalHtml);
    }
}
