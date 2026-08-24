@extends('layouts.app')

@section('title', $chapter['title'] . ' — ' . $series['title'])
@section('description', $series['title'] . ' — ' . $chapter['title'])

@section('content')

    <div class="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-20">
        <nav class="flex items-center gap-2 text-sm mb-6 flex-wrap" style="color:var(--muted)">
            <a href="{{ route('home') }}" class="hover:text-[var(--primary)] transition-colors">Library</a>
            <i class="fa-solid fa-chevron-right text-[10px]"></i>
            <a href="{{ route('series', $series['id']) }}"
                class="hover:text-[var(--primary)] transition-colors">{{ $series['title'] }}</a>
            <i class="fa-solid fa-chevron-right text-[10px]"></i>
            <span style="color:var(--fg)">Ch {{ $index + 1 }}</span>
        </nav>

        <div class="flex items-center gap-3 mb-2">
            <span class="badge"
                style="background:{{ diffColor($chapter['diff']) }}18;color:{{ diffColor($chapter['diff']) }}">{{ diffLabel($chapter['diff']) }}</span>
            <span class="text-sm" style="color:var(--muted)"><i class="fa-regular fa-clock mr-1"></i>{{ $chapter['dur'] }}
                read</span>
            <div class="flex-1"></div>
            <button class="chapter-check" id="chapter-check-main" data-toggle-check
                data-key="{{ $series['id'] }}-{{ $chapter['id'] }}" onclick="toggleChapter(this)"></button>
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold font-serif mb-6" style="color:var(--fg)">{{ $chapter['title'] }}</h1>

        <div class="progress-bar mb-8" style="height:3px">
            <div class="progress-fill" id="read-progress" style="width:0%"></div>
        </div>

        <div class="grid lg:grid-cols-4 gap-10">
            <aside class="hidden lg:block">
                <div class="sticky top-20">
                    <div class="text-xs font-bold uppercase tracking-widest mb-3" style="color:var(--muted)">In This
                        Chapter</div>
                    <nav id="toc-nav" class="space-y-0.5">
                        @foreach ($chapter['toc'] as $t)
                            <a class="toc-item" data-toc="{{ $t['id'] }}" href="#{{ $t['id'] }}">{{ $t['label'] }}</a>
                        @endforeach
                    </nav>
                    <div class="mt-6 pt-4" style="border-top:1px solid var(--border)"
                        data-series-id="{{ $series['id'] }}"
                        data-chapter-ids="{{ implode(',', array_column($series['chapters'], 'id')) }}">
                        <div class="text-xs font-bold uppercase tracking-widest mb-2" style="color:var(--muted)">Series
                            Progress</div>
                        <div class="text-sm font-semibold series-pct" data-pct-template="{}% complete"
                            style="color:var(--fg)">0% complete</div>
                        <div class="progress-bar mt-2">
                            <div class="progress-fill series-progress-fill" style="width:0%;background:{{ $series['color'] }}">
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <article class="lg:col-span-3">
                <div class="prose" id="chapter-prose">
                    {!! $chapter['html'] !!}

                    @if ($chapter['id'] === 'ca1')
                        <div class="my-8">
                            <div class="flex items-center justify-between mb-3">
                                <h3
                                    style="margin:0;font-family:'DM Sans',sans-serif;font-weight:600;font-size:1rem;color:var(--fg)">
                                    Before: Tightly Coupled</h3>
                                <button class="btn-primary text-xs py-2 px-4" id="diff-toggle-btn"
                                    onclick="animateDiff()"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i>Apply DIP
                                    Refactor</button>
                            </div>
                            <div class="diff-widget" id="diff-widget" style="background:var(--card)">
                                <div class="diff-line neutral">  class UserService {</div>
                                <div class="diff-line neutral">    constructor() {</div>
                                <div class="diff-line remove">-     this.db = new PostgreSQLConnection('db://...');
                                </div>
                                <div class="diff-line neutral">  }</div>
                                <div class="diff-line neutral"></div>
                                <div class="diff-line neutral">  getUser(id) {</div>
                                <div class="diff-line remove">-     return this.db.query('SELECT * FROM users WHERE id
                                    = $1', [id]);</div>
                                <div class="diff-line neutral">  }</div>
                                <div class="diff-line neutral">}</div>
                            </div>
                            <p class="text-xs mt-2" style="color:var(--muted)" id="diff-hint">Click the button to see
                                the refactoring animated line by line.</p>
                        </div>

                        <div class="my-8">
                            <div class="flex items-center justify-between mb-3">
                                <h3
                                    style="margin:0;font-family:'DM Sans',sans-serif;font-weight:600;font-size:1rem;color:var(--fg)">
                                    <i class="fa-solid fa-play text-xs mr-2" style="color:var(--primary)"></i>Interactive
                                    Playground</h3>
                                <button class="btn-ghost text-xs py-1.5 px-3" onclick="runPlayground()"><i
                                        class="fa-solid fa-rotate-right mr-1"></i>Re-run</button>
                            </div>
                            <div class="code-playground">
                                <textarea id="playground-code" spellcheck="false">{{ $playgroundCode ?? '' }}</textarea>
                                <div class="code-output" id="playground-output"></div>
                            </div>
                            <p class="text-xs mt-2" style="color:var(--muted)">Edit the code above. Output updates as
                                you type.</p>
                        </div>
                    @endif
                </div>

                <div class="grid sm:grid-cols-2 gap-4 mt-12 pt-8" style="border-top:1px solid var(--border)">
                    @if ($prevChapter)
                        <a href="{{ route('chapter', [$series['id'], $prevChapter['id']]) }}"
                            class="card p-4 text-left hover:border-[var(--primary)]">
                            <div class="text-xs mb-1" style="color:var(--muted)"><i
                                    class="fa-solid fa-arrow-left mr-1"></i>Previous</div>
                            <div class="font-semibold text-sm" style="color:var(--fg)">{{ $prevChapter['title'] }}</div>
                        </a>
                    @else
                        <div></div>
                    @endif
                    @if ($nextChapter)
                        <a href="{{ route('chapter', [$series['id'], $nextChapter['id']]) }}"
                            class="card p-4 text-right hover:border-[var(--primary)]">
                            <div class="text-xs mb-1" style="color:var(--muted)">Next<i
                                    class="fa-solid fa-arrow-right ml-1"></i></div>
                            <div class="font-semibold text-sm" style="color:var(--fg)">{{ $nextChapter['title'] }}</div>
                        </a>
                    @else
                        <div></div>
                    @endif
                </div>
            </article>
        </div>
    </div>

@endsection

@section('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', () => window.initChapterPage && window.initChapterPage());
    </script>
@endsection
