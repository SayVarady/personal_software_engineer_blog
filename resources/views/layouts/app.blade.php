<!DOCTYPE html>
<html lang="en" class="scroll-smooth">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', "Varady's Notebook — Personal Software Engineering Tutorials")</title>
    <meta name="description" content="@yield('description', 'Personal software engineering journey, tutorials, and career notes.')">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link
        href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Fira+Code:wght@400;500;600&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('css/tailwind.css') }}">
    <link rel="stylesheet" href="{{ asset('css/site.css') }}">
    <script>
        // Applied before paint to avoid a light/dark flash.
        if (localStorage.getItem('dark') === '1') document.documentElement.classList.add('dark');
    </script>
</head>

<body>

    <nav id="navbar" class="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b"
        style="background:color-mix(in srgb, var(--bg) 85%, transparent);border-color:var(--border)">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <a href="{{ route('home') }}" class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:var(--primary)"><i
                        class="fa-solid fa-route text-white text-sm"></i></div>
                <span class="font-bold text-lg tracking-tight" style="color:var(--fg)">Varady's <span
                        style="color:var(--primary)">Notebook</span></span>
            </a>
            <div class="hidden sm:flex items-center gap-6 text-sm font-medium" style="color:var(--fg2)">
                <a href="{{ route('home') }}" class="hover:text-[var(--primary)] transition-colors">Library</a>
                <a href="{{ route('series', 'system-design') }}"
                    class="hover:text-[var(--primary)] transition-colors">Featured</a>
                <span class="cursor-default" style="color:var(--muted)">Community</span>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="toggleTheme()"
                    class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                    style="color:var(--fg2)" aria-label="Toggle theme">
                    <i class="fa-solid fa-sun text-sm" id="theme-icon"></i>
                </button>
            </div>
        </div>
    </nav>

    <main id="app" class="pt-14 min-h-screen">
        @yield('content')
    </main>
    <canvas id="celebration-canvas"></canvas>

    <script src="{{ asset('js/app.js') }}"></script>
    @yield('scripts')
</body>

</html>
