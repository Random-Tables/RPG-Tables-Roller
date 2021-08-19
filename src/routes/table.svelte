<script lang="ts">
	import { browser } from '$app/env';
	export const router = browser;
	import { onMount } from 'svelte';
	import CollectionBuilder from '$lib/CollectionsBuilder';
	import { STATUS } from '$lib/enums';
	import Viewer from '$lib/Viewer/index.svelte';

	let status = STATUS.UNSTARTED;
	let masterIndex = {};
	let view = 'all';
	let choiceArray: Array<Choice> = [];

	onMount(async () => {
		status = CollectionBuilder.getStatus();
		if (status !== STATUS.BUILT) {
			console.log('not built');
		}
		if (view === 'all') {
			masterIndex = CollectionBuilder.getMasterIndex();
		}
	});

	function onClickTable(collection, tablesGroupKey, tableName) {
		CollectionBuilder.getRoll(collection, tablesGroupKey, tableName.toString()).then((res) => {
			// get options
			console.log('res', res);
			choiceArray = [...choiceArray, res];
		});
	}
</script>

<svelte:head>
	<title>Tables</title>
</svelte:head>

<div class="content">
	<div class="aside">
		<b>Building indexes....</b>
		{#if status === STATUS.BUILT}
			<span>Built</span><br />
			{#each Object.keys(masterIndex) as collection}
				<h3>Collection: {masterIndex[collection].collectionName}</h3>
				{#each Object.keys(masterIndex[collection].tablesData) as tablesGroupKey}
					<h4>{tablesGroupKey}</h4>
					{#each masterIndex[collection].tablesData[tablesGroupKey].tablesList as tableName}
						<button on:click={() => onClickTable(collection, tablesGroupKey, tableName.toString())}
							>{tableName}</button
						>
					{/each}
				{/each}
			{/each}
		{/if}
	</div>
	<div class="main">
		<h3>Views</h3>
		<Viewer choices={choiceArray} />
	</div>
</div>

<style>
	.content {
		width: 100%;
		margin: var(--column-margin-top) auto 0 auto;
		display: flex;
	}
	.aside {
		width: 50%;
	}
	.main {
		width: 50%;
	}
</style>
