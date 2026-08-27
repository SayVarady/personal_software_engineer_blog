<?php

namespace App\Providers;

use App\Services\ContentRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ContentRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Check if running on Vercel serverless environment
        if (env('VERCEL_JOB_ID') || env('NOW_REGION')) {
            // Redirect views cache to the writable /tmp folder
            config(['view.compiled' => '/tmp/storage/framework/views']);

            // Redirect application cache data to the writable /tmp folder
            config(['cache.stores.file.path' => '/tmp/storage/framework/cache/data']);

            // Ensure the directory structure exists dynamically
            if (!is_dir('/tmp/storage/framework/views')) {
                mkdir('/tmp/storage/framework/views', 0755, true);
            }
            if (!is_dir('/tmp/storage/framework/cache/data')) {
                mkdir('/tmp/storage/framework/cache/data', 0755, true);
            }
        }
    }
}
