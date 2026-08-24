<?php

if (! function_exists('diffColor')) {
    function diffColor(string $diff): string
    {
        return match ($diff) {
            'beginner' => 'var(--primary)',
            'intermediate' => 'var(--accent)',
            default => 'var(--danger)',
        };
    }
}

if (! function_exists('diffLabel')) {
    function diffLabel(string $diff): string
    {
        return match ($diff) {
            'beginner' => 'Beginner',
            'intermediate' => 'Intermediate',
            default => 'Advanced',
        };
    }
}
