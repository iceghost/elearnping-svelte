<script lang="ts">
    import { db, token } from './stores';

    let unverifiedToken: string;
    let valid: boolean;

    async function onClick() {
        loading = true;
        const res = await fetch('https://elearnping-go.fly.dev/api/login', {
            headers: {
                Authorization: `Bearer ${unverifiedToken}`,
            },
        });

        valid = await res.json();
        if (valid) {
            $token = unverifiedToken;
        }
        loading = false;
    }

    let loading = false;

    let showHelp = false;
</script>

<div class="min-h-screen flex flex-col justify-center max-w-sm mx-auto">
    <h1 class="text-center font-bold text-2xl mb-5 text-blue-900">
        Elearnping!
    </h1>
    <form
        class="flex justify-center items-stretch h-10 mb-5"
        on:submit|preventDefault={onClick}
    >
        <input
            class="flex-1 shadow-sm rounded-l-md px-2"
            bind:value={unverifiedToken}
        />
        <button
            class="bg-blue-600 px-3 uppercase text-sm font-bold text-white rounded-r-md disabled:bg-blue-300"
            disabled={loading}
        >
            Đăng nhập
        </button>
    </form>
    <button
        class="text-sm flex items-center justify-end space-x-1 hover:underline"
        on:click={() => (showHelp = true)}
    >
        <!-- prettier-ignore -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
        <span>Lấy token ở đâu?</span>
    </button>
    {#if valid == false}
        <p class="text-center text-red-500 mt-2 font-bold">
            Token không hợp lệ
        </p>
    {/if}
</div>

{#if showHelp}
    <div
        class="bg-blue-900/10 absolute inset-0"
        on:click={() => (showHelp = false)}
    />
    <div
        class="rounded-md shadow-md bg-white w-full max-w-xl absolute inset-y-16 -inset-x-auto py-8 px-4 space-y-5 flex flex-col items-center text-center overflow-scroll text-lg"
    >
        <h1 class="font-bold text-xl">Hướng dẫn</h1>
        <p>
            Đăng nhập vào trang BKeL. Trên mũi tên kế bên tài khoản của bạn,
            chọn "Tùy chọn".
        </p>
        <img class="w-48" src="/step2.jpg" alt="step 2" />
        <p>Trong "Tùy chọn", chọn Security keys.</p>
        <img class="w-48" src="/step3.jpg" alt="step 3" />
        <p>Token của bạn là Key ở dòng "Moodle mobile web service".</p>
        <img class="w-48" src="/step4.jpg" alt="step 4" />
        <p>Sao chép Token của bạn và quay lại đây.</p>
        <button
            class="bg-blue-500 px-2 py-1 text-white rounded-md shadow-md"
            on:click={() => (showHelp = false)}>Ukie</button
        >
    </div>
{/if}
