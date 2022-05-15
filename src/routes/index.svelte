<script lang="ts">
    import Main from '$lib/Main.svelte';
    import Login from '$lib/Login.svelte';
    import { correctTokenPromise, promise, token } from '$lib/stores';
    import { Jumper } from 'svelte-loading-spinners';
</script>

<div class="w-full max-w-2xl mx-auto font-quicksand">
    {#await promise}
        <div class="flex flex-col justify-center items-center min-h-screen">
            <p>Load thông tin trên trình duyệt...</p>
            <Jumper size="60" unit="px" duration="1s" />
        </div>
    {:then}
        {#if !$token}
            <Login />
        {:else}
            {#await correctTokenPromise}
                <div
                    class="flex flex-col justify-center items-center min-h-screen"
                >
                    <p>Load danh sách site...</p>
                    <Jumper size="60" unit="px" duration="1s" />
                </div>
            {:then}
                <Main />
            {/await}
        {/if}
    {:catch e}
        <p>Một lỗi gì đó đã xảy ra...</p>
        <pre class="overflow-scroll">{e}</pre>
    {/await}
    <footer class="p-2 inset-x-0 mt-10 pt-3 border-t border-gray-300 text-gray-400">
        <p class="text-center">
            elearnping 🏓 · một BTL LTNC nho nhỏ
        </p>
    </footer>
</div>
