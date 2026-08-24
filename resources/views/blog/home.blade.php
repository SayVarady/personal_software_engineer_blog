@extends('layouts.app')

@section('content')

    <section class="hero-dots relative overflow-hidden" style="background:var(--bg)">
        <div class="absolute inset-0"
            style="background:radial-gradient(ellipse at 30% 20%, color-mix(in srgb, var(--primary) 8%, transparent), transparent 60%), radial-gradient(ellipse at 80% 80%, color-mix(in srgb, var(--accent) 6%, transparent), transparent 50%)">
        </div>
        <div class="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12">
            <div class="max-w-2xl">
                <div class="badge mb-4" style="background:var(--primary-pale);color:var(--primary)">Start Here
                </div>
                <h1 class="font-serif text-4xl sm:text-5xl font-bold leading-tight mb-4" style="color:var(--fg)">
                    Networking<br>Fundamentals</h1>
                <p class="text-lg mb-6" style="color:var(--fg2);line-height:1.7">
                    The entire collection of my knowledge throughout my entire career.
                    What I have learned along the way and what I have built.
                    An eight-series roadmap and still growing. Zero hand-waving.
                    How machines actually find and talk to each other — DNS, TCP/IP, sockets, routing — the floor
                    every other series here stands on, all the way to building things that scale. This is not an
                    advice or best practice, it is just what I have come to understand

                </p>
                <div class="flex flex-wrap gap-3">
                    <a href="{{ route('series', 'networking') }}" class="btn-primary"><i
                            class="fa-solid fa-arrow-right mr-2"></i>Start Learning</a>
                    <a href="#library" class="btn-ghost">Browse All Series</a>
                </div>
            </div>
        </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h2 class="text-sm font-bold uppercase tracking-widest mb-5" style="color:var(--muted)">New This Week</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @foreach ($newChapters as $nc)
                <a href="{{ route('chapter', [$nc['seriesId'], $nc['chId']]) }}" class="card p-4 flex gap-4">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style="background:{{ $nc['seriesColor'] }}15;color:{{ $nc['seriesColor'] }}"><i
                            class="fa-solid {{ $nc['seriesIcon'] }}"></i></div>
                    <div class="min-w-0">
                        <div class="text-xs font-medium mb-1 truncate" style="color:{{ $nc['seriesColor'] }}">
                            {{ $nc['seriesTitle'] }}</div>
                        <div class="font-semibold text-sm mb-1" style="color:var(--fg)">{{ $nc['title'] }}</div>
                        <div class="text-xs" style="color:var(--muted)">
                            {{ \Illuminate\Support\Carbon::parse($nc['date'])->format('M j') }}</div>
                    </div>
                </a>
            @endforeach
        </div>
    </section>

    <section id="library" class="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-sm font-bold uppercase tracking-widest" style="color:var(--muted)">Series Library</h2>
            <span class="text-sm" style="color:var(--fg2)">{{ count($series) }} series,
                {{ collect($series)->sum(fn($s) => count($s['chapters'])) }} chapters</span>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            @foreach ($series as $s)
                <a href="{{ route('series', $s['id']) }}" class="card p-5 fade-up block"
                    data-series-id="{{ $s['id'] }}"
                    data-chapter-ids="{{ implode(',', array_column($s['chapters'], 'id')) }}">
                    <div class="flex items-start justify-between mb-3">
                        <div class="w-11 h-11 rounded-xl flex items-center justify-center"
                            style="background:{{ $s['color'] }}15;color:{{ $s['color'] }}"><i
                                class="fa-solid {{ $s['icon'] }} text-lg"></i></div>
                        <span class="text-xs font-bold series-pct" data-pct-template="{}%"
                            style="color:var(--muted)">0%</span>
                    </div>
                    <h3 class="font-bold text-base mb-2" style="color:var(--fg)">{{ $s['title'] }}</h3>
                    <p class="text-sm mb-4" style="color:var(--fg2);line-height:1.6">
                        {{ Str::limit($s['desc'], 100) }}</p>
                    <div class="progress-bar mb-2">
                        <div class="progress-fill series-progress-fill" style="width:0%;background:{{ $s['color'] }}">
                        </div>
                    </div>
                    <div class="text-xs" style="color:var(--muted)"><span class="series-done-count">0</span> of
                        {{ count($s['chapters']) }} chapters completed</div>
                </a>
            @endforeach
        </div>
    </section>

@endsection
