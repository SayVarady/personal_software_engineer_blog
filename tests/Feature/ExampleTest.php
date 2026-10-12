<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_chapter_with_motion_graphics_renders_successfully(): void
    {
        $response = $this->get('/series/db-internals/db1');

        $response->assertStatus(200);
        $response->assertSee('data-motion-type="diagram"', false);
        $response->assertSee('data-motion-type="steps"', false);
        $response->assertSee('motion-pipeline-beacon', false);
        $response->assertSee('Interactive Architecture: RAM Buffer vs Physical Disk', false);
    }
}
