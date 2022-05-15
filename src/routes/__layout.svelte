<script>
import { onMount } from 'svelte';

    import '../app.css';
</script>

<svelte:head>
    <title>elearnping! 🏓</title>
</svelte:head>

<slot />

<style global lang="postcss">
    body {
        @apply bg-blue-100;
    }
</style>
