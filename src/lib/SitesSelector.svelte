<script lang="ts">
    import { selectedSites, sites } from '$lib/stores';

    async function onClick(id: number, checked: boolean) {
        selectedSites.update((sites) => {
            if (!checked) {
                sites.add(id);
            } else {
                sites.delete(id);
            }
            return sites;
        });
    }
</script>

{#await $sites then sites}
    {#each Object.entries(sites) as [key, val]}
        {@const checkedAll = val.every((site) => $selectedSites.has(site.id))}
        <p class="font-bold">
            <label>
                <input
                    type="checkbox"
                    on:change={() => val.forEach((site) => onClick(site.id, checkedAll))}
                    checked={checkedAll}
                />
                {key}
            </label>
        </p>
        <ul class="ml-6">
            {#each val as site}
                {@const checked = $selectedSites.has(site.id)}
                <li>
                    <label>
                        <input
                            type="checkbox"
                            on:change={(e) => onClick(site.id, checked)}
                            {checked}
                        />
                        {site.fullname}
                    </label>
                </li>
            {/each}
        </ul>
    {/each}
{/await}
