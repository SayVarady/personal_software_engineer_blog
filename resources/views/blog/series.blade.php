@extends('layouts.app')

@section('title', $series['title'] . ' — Rady Daries')
@section('description', $series['desc'])

@section('content')

    <div class="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-20">
        <nav class="flex items-center gap-2 text-sm mb-8" style="color:var(--muted)">
            <a href="{{ route('home') }}" class="hover:text-[var(--primary)] transition-colors">Library</a>
            <i class="fa-solid fa-chevron-right text-[10px]"></i>
            <span style="color:var(--fg)">{{ $series['title'] }}</span>
        </nav>

        <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style="background:{{ $series['color'] }}15;color:{{ $series['color'] }}"><i
                    class="fa-solid {{ $series['icon'] }} text-2xl"></i></div>
            <div class="flex-1">
                <h1 class="text-2xl sm:text-3xl font-bold mb-1" style="color:var(--fg)">{{ $series['title'] }}</h1>
                <p class="text-sm" style="color:var(--fg2)">{{ $series['desc'] }}</p>
            </div>
            <div class="text-right flex-shrink-0" data-series-id="{{ $series['id'] }}"
                data-chapter-ids="{{ implode(',', array_column($series['chapters'], 'id')) }}">
                <div class="text-3xl font-bold series-pct" data-pct-template="{}%" style="color:{{ $series['color'] }}">
                    0%</div>
                <div class="text-xs" style="color:var(--muted)">Complete</div>
            </div>
        </div>
        <div class="progress-bar mb-10" data-series-id="{{ $series['id'] }}"
            data-chapter-ids="{{ implode(',', array_column($series['chapters'], 'id')) }}">
            <div class="progress-fill series-progress-fill" style="width:0%;background:{{ $series['color'] }}"></div>
        </div>

        <div class="grid lg:grid-cols-5 gap-10">
            <div class="lg:col-span-3">
                <h2 class="text-sm font-bold uppercase tracking-widest mb-4" style="color:var(--muted)">Chapters</h2>
                <div class="space-y-1">
                    @foreach ($series['chapters'] as $i => $c)
                        <div class="flex items-center gap-4 p-4 rounded-xl transition-colors group chapter-row"
                            data-key="{{ $series['id'] }}-{{ $c['id'] }}">
                            <a href="{{ route('chapter', [$series['id'], $c['id']]) }}"
                                class="chapter-check" data-toggle-check
                                data-key="{{ $series['id'] }}-{{ $c['id'] }}" onclick="event.preventDefault(); event.stopPropagation(); toggleChapter(this)"></a>
                            <a href="{{ route('chapter', [$series['id'], $c['id']]) }}" class="flex-1 min-w-0 flex items-center gap-4">
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 mb-0.5">
                                        <span class="text-xs font-mono" style="color:var(--muted)">Ch {{ $i + 1 }}</span>
                                        <span class="badge text-[10px]"
                                            style="background:{{ diffColor($c['diff']) }}18;color:{{ diffColor($c['diff']) }}">{{ diffLabel($c['diff']) }}</span>
                                    </div>
                                    <div class="font-semibold text-sm group-hover:text-[var(--primary)] transition-colors"
                                        style="color:var(--fg)">{{ $c['title'] }}</div>
                                </div>
                                <span class="text-xs flex-shrink-0" style="color:var(--muted)">{{ $c['dur'] }}</span>
                                <i class="fa-solid fa-chevron-right text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    style="color:var(--muted)"></i>
                            </a>
                        </div>
                    @endforeach
                </div>
            </div>

            <div class="lg:col-span-2">
                <h2 class="text-sm font-bold uppercase tracking-widest mb-4" style="color:var(--muted)">Prerequisite
                    Map</h2>
                <div class="card p-5">
                    <svg viewBox="0 0 900 400" class="w-full max-w-xl mx-auto" style="display:block">
                        @foreach ($graph['edges'] as $e)
                            <path d="{{ $e['path'] }}" class="graph-line"
                                @if ($e['highlighted']) style="stroke:var(--primary);stroke-width:2.5;opacity:0.7" @endif />
                            <polygon points="{{ $e['arrow'] }}"
                                fill="{{ $e['highlighted'] ? 'var(--primary)' : 'var(--muted)' }}" opacity="0.6" />
                        @endforeach
                        @foreach ($graph['nodes'] as $n)
                            <a href="{{ route('series', $n['id']) }}">
                                <g class="nav-node">
                                    <circle cx="{{ $n['x'] }}" cy="{{ $n['y'] }}" r="{{ $n['r'] }}"
                                        fill="{{ $n['current'] ? $n['color'] . '22' : 'var(--card)' }}"
                                        stroke="{{ $n['current'] ? $n['color'] : 'var(--border)' }}"
                                        stroke-width="{{ $n['current'] ? 3 : 1.5 }}" />
                                    <text x="{{ $n['x'] }}" y="{{ $n['y'] + 1 }}" text-anchor="middle"
                                        dominant-baseline="middle" font-size="10" font-weight="600"
                                        fill="{{ $n['current'] ? $n['color'] : 'var(--fg2)' }}"
                                        font-family="DM Sans">{{ $n['label'] }}</text>
                                </g>
                            </a>
                        @endforeach
                    </svg>
                </div>
                <p class="text-xs mt-3" style="color:var(--muted)">Click any node to navigate.</p>
            </div>
        </div>
    </div>

@endsection
