<script lang="ts">
    import SitesSelector from '$lib/SitesSelector.svelte';
    import Updates from '$lib/Updates.svelte';

    export let tab: 'select' | 'updates' = 'updates';
</script>

<div class="flex justify-around mt-5">
    <button
        class="px-5 py-2 rounded-t-md flex items-center space-x-2"
        class:active={tab == 'updates'}
        on:click={() => (tab = 'updates')}
    >
        <!-- prettier-ignore -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <span>Các updates</span>
    </button>
    <button
        class="px-5 py-2 rounded-t-md flex items-center space-x-2"
        class:active={tab == 'select'}
        on:click={() => (tab = 'select')}
    >
        <!-- prettier-ignore -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span>Chọn sites môn học</span>
    </button>
</div>
<div class="bg-white shadow-md p-4 rounded-md">
    {#if tab == 'select'}
        <SitesSelector />
    {:else if tab == 'updates'}
        <Updates />
    {/if}
</div>

<style lang="postcss">
    .active {
        @apply bg-white;
    }
</style>
