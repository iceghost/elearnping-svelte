<script lang="ts">
    import { token, selectedSites, db, lastrun } from '$lib/stores';
    import { onMount } from 'svelte';
    import { Jumper } from 'svelte-loading-spinners';
    import type { Update } from './types';

    let updates: Update[] = [];
    let done: boolean = true;
    let date: string;

    const getSites = async () => {
        done = false;
        updates = [];
        const time = new Date(date).valueOf();
        const res = await fetch(
            `https://elearnping-go.fly.dev/api/updates?since=${Math.trunc(
                time
            )}`,
            {
                headers: {
                    Authorization: `Bearer ${$token}`,
                },
            }
        );
        updates = (await res.json()) || [];
        updates = updates.filter((update) =>
            $selectedSites.has(update.site.id)
        );
        // console.log(updates);
        done = true;
        $lastrun = Math.max(time, $lastrun);
    };

    function formatDate(dt: Date): string {
        // prettier-ignore
        return `${
            dt.getFullYear().toString().padStart(4, '0')}-${
            (dt.getMonth()+1).toString().padStart(2, '0')}-${
            dt.getDate().toString().padStart(2, '0')}T${
            dt.getHours().toString().padStart(2, '0')}:${
            dt.getMinutes().toString().padStart(2, '0')}`
    }

    onMount(() => {
        getSites();
    });

    async function toggleNotif() {
        console.log('...');
        const notifPermission = await Notification.requestPermission();
        if (notifPermission == 'denied' || notifPermission == 'default')
            return alert('nofitication permission is off');
        const registration = await navigator.serviceWorker.ready;
        try {
            // @ts-ignore
            await registration.periodicSync.register('get-updates', {
                minInterval: 60 * 60 * 1000,
            });
            alert('success');
        } catch {
            alert('Periodic Sync could not be registered!');
        }
    }

    let timeOption: 'today' | 'yesterday' | 'this week' | 'custom' = 'today';

    $: {
        if (timeOption == 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            date = formatDate(today);
        } else if (timeOption == 'yesterday') {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            date = formatDate(yesterday);
        } else if (timeOption == 'this week') {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 7);
            date = formatDate(yesterday);
        } else {
            date = formatDate(new Date());
        }
    }
</script>

<div class="border-b pb-4 flex justify-between">
    <div class="flex space-x-2">
        <label>
            Kể từ:
            <select
                class="bg-blue-50 px-2 py-2 rounded-md"
                bind:value={timeOption}
            >
                <option value="today">Từ sáng hôm nay</option>
                <option value="yesterday">Từ sáng hôm qua</option>
                <option value="this week">1 tuần trước</option>
                <option value="custom">Custom</option>
            </select>
            {#if timeOption == 'custom'}
                <input
                    class="bg-blue-50 px-2 py-1 rounded-md"
                    type="datetime-local"
                    bind:value={date}
                />
            {/if}
        </label>
        <button
            class="bg-blue-500 text-white px-2 py-1 rounded-md disabled:cursor-not-allowed disabled:bg-blue-50 disabled:text-blue-300 hover:bg-blue-200 hover:text-blue-800"
            disabled={date === undefined}
            on:click={getSites}
        >
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
        </svg>
        </button>
    </div>
    <button on:click={toggleNotif}>Bật thông báo</button>
</div>

{#if $selectedSites.size == 0}
    <p class="text-center text-lg mt-5">Xin chào!</p>
    <img
        src="/purr-cat-16.png"
        alt="cat with coffee"
        class="w-32 mx-auto my-5"
    />
    <p class="text-center text-lg mb-5">
        Bấm vào "Chọn sites môn học" để chọn các sites cần quan tâm nhé.
    </p>
{:else}
    {#each updates as update}
        <div class="border-b py-2">
            <h3 class="font-bold text-blue-800 my-2">
                <a
                    href="http://e-learning.hcmut.edu.vn/course/view.php?id={update
                        .site.id}"
                    target="_blank"
                >
                    {update.site.fullname}
                </a>
            </h3>
            <ul class="list-disc ml-4">
                {#each update.updates as update}
                    <li>
                        <p>
                            <a
                                href="http://e-learning.hcmut.edu.vn/mod/{update
                                    .module.modname}/view.php?id={update.module
                                    .id}"
                                target="_blank"
                            >
                                {update.module.modname} - {@html update.module
                                    .name}
                            </a>
                        </p>
                        <p class="space-x-1">
                            {#each update.areas as area}
                                <span
                                    class="rounded-full bg-green-200 text-xs px-1"
                                    >{area.name}</span
                                >
                            {/each}
                        </p>
                    </li>
                {/each}
            </ul>
            <p
                class="flex items-center justify-end text-gray-500 space-x-1 text-sm"
            >
                <!-- prettier-ignore -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                </svg>
                <span>
                    Tính từ thời điểm {new Date(update.from).toLocaleString()}
                </span>
            </p>
        </div>
    {/each}

    {#if !done}
        <div class="flex flex-col items-center mt-4">
            <p class="text-center">Đang check updates...</p>
            <Jumper size="30" unit="px" duration="1s" />
        </div>
    {:else if updates.length > 0}
        <p class="text-center text-gray-500 my-2">Hết danh sách</p>
    {:else}
        <img
            src="/purr-coffee-break-2.png"
            alt="cat with coffee"
            class="w-1/3 mx-auto my-5"
        />
        <p class="text-lg text-center mb-5 text-gray-500">
            Không có updates gì hết. Khỏe nhỉ?
        </p>
    {/if}
{/if}
