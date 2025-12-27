/**
 * Perfis de Stack Técnica
 * Define regras adicionais que serão injetadas nos agentes
 */

const STACK_PROFILES = {
    // --- GENERIC ---
    'generic': {
        label: '🌐 Genérico / Nenhum',
        rules: []
    },

    // --- FRONTEND ---
    'frontend-react': {
        label: '🎨 Frontend: React + Tailwind',
        rules: [
            "Prefer Functional Components with Hooks.",
            "Use Tailwind CSS for styling. Avoid inline styles.",
            "Ensure accessibility (a11y) standards are met.",
            "Use strict type checking if TypeScript is enabled.",
            "Prefer React Query or SWR for data fetching."
        ]
    },
    'frontend-next': {
        label: '🎨 Frontend: Next.js (App Router)',
        rules: [
            "Use App Router directory structure.",
            "Prefer Server Components by default; use 'use client' only when necessary.",
            "Optimize images using next/image.",
            "Use Server Actions for mutations."
        ]
    },
    'frontend-vue': {
        label: '🎨 Frontend: Vue.js 3 + Pinia',
        rules: [
            "Use Composition API with <script setup>.",
            "Use Pinia for state management.",
            "Prefer Tailwind CSS or Scoped CSS.",
            "Follow the Vue Style Guide Priority A rules."
        ]
    },
    'frontend-angular': {
        label: '🎨 Frontend: Angular',
        rules: [
            "Use Standalone Components.",
            "Prefer Signals over RxJS for synchronous state.",
            "Strictly follow the Angular Style Guide.",
            "Use Dependency Injection patterns."
        ]
    },
    'frontend-svelte': {
        label: '🎨 Frontend: SvelteKit',
        rules: [
            "Use Svelte 5 Runes syntax if available.",
            "Leverage SvelteKit's load functions for server-side data.",
            "Keep stores simple and derived."
        ]
    },

    // --- BACKEND ---
    'backend-node': {
        label: '⚙️ Backend: Node.js (Express)',
        rules: [
            "Prefer Async/Await over raw Promises.",
            "Follow Error Handling best practices (don't ignore errors).",
            "Use Environment Variables for configuration.",
            "Adhere to RESTful API standards."
        ]
    },
    'backend-nest': {
        label: '⚙️ Backend: NestJS',
        rules: [
            "Use Dependency Injection strictly.",
            "Follow the module structure.",
            "Use DTOs with ValidationPipe for all inputs.",
            "Prefer TypeORM or Prisma for database interaction."
        ]
    },
    'backend-python-fastapi': {
        label: '⚙️ Backend: Python (FastAPI)',
        rules: [
            "Use Pydantic models for data validation.",
            "Use Type Hints for function arguments and return values.",
            "Implement async/await for I/O bound operations.",
            "Follow PEP 8 style guidelines."
        ]
    },
    'backend-python-django': {
        label: '⚙️ Backend: Python (Django)',
        rules: [
            "Use Class-Based Views (CBVs) where appropriate.",
            "Follow the 'Fat Models, Thin Views' philosophy.",
            "Use Django ORM optimizations (select_related, prefetch_related).",
            "Keep settings separated for dev/prod."
        ]
    },
    'backend-java-spring': {
        label: '⚙️ Backend: Java (Spring Boot)',
        rules: [
            "Use constructor injection over @Autowired.",
            "Follow Google Java Style Guide.",
            "Use Lombok to reduce boilerplate code.",
            "Handle exceptions with @ControllerAdvice."
        ]
    },
    'backend-csharp': {
        label: '⚙️ Backend: C# (.NET Core)',
        rules: [
            "Follow Microsoft's C# Coding Conventions.",
            "Use Async/Await all the way down.",
            "Prefer LINQ for collection manipulation.",
            "Use Dependency Injection via IServiceCollection."
        ]
    },
    'backend-go': {
        label: '⚙️ Backend: Go (Golang)',
        rules: [
            "Handle errors explicitly (if err != nil).",
            "Follow strict formatting (gofmt).",
            "Prefer standard library over external dependencies when possible.",
            "Use context for cancellation and timeouts."
        ]
    },

    // --- MOBILE ---
    'mobile-react-native': {
        label: '📱 Mobile: React Native',
        rules: [
            "Use Functional Components and Hooks.",
            "Avoid bridge passing heavy data.",
            "Optimize lists with FlatList or FlashList.",
            "Style using StyleSheet objects or styled-components."
        ]
    },
    'mobile-flutter': {
        label: '📱 Mobile: Flutter',
        rules: [
            "Use const constructors whenever possible.",
            "Prefer Composition over Inheritance.",
            "Manage state with Riverpod or BLoC.",
            "Follow Effective Dart guidelines."
        ]
    },
    'mobile-ios': {
        label: '📱 Mobile: iOS (SwiftUI)',
        rules: [
            "Use MVVM pattern.",
            "Prefer Structs over Classes for data models.",
            "Use strict concurrency checking.",
            "Follow Apple's Human Interface Guidelines."
        ]
    },
    'mobile-android': {
        label: '📱 Mobile: Android (Kotlin Compose)',
        rules: [
            "Use Jetpack Compose for UI.",
            "Follow Material Design 3 guidelines.",
            "Use Coroutines and Flow for async work.",
            "Implement Hilt for Dependency Injection."
        ]
    },

    // --- DATA & AI ---
    'data-python': {
        label: '📊 Data Science: Python',
        rules: [
            "Use Pandas vectorization over loops.",
            "Document notebooks with Markdown cells explaining logic.",
            "Use Type Hints even in scripts.",
            "Prefer Polars for large datasets if possible."
        ]
    },

    // --- INFRASTRUCTURE ---
    'infra-terraform': {
        label: '☁️ Infra: Terraform',
        rules: [
            "Use modules for reusable resources.",
            "Keep state remote and locked.",
            "Format code with `terraform fmt`.",
            "Avoid hardcoding values; use variables."
        ]
    }
};

module.exports = { STACK_PROFILES };