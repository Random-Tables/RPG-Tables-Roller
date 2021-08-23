<script lang="ts">
	import { browser } from '$app/env';
	export const router = browser;
	import { onMount } from 'svelte';
	import CollectionBuilder from '$lib/CollectionsBuilder';
	import { STATUS } from '$lib/enums';
	import Viewer from '$lib/Viewer/index.svelte';
	import { viewsBuilt } from '$lib/stores';
	import CollectionBar from '$lib/CollectionsBar/index.svelte';
	import CollectionExpansion from '$lib/CollectionsBar/expansion.svelte';

	let status = STATUS.UNSTARTED;
	let masterIndex = {};
	let view = 'all';
	let choiceArray: Array<Choice | string> = [];
	viewsBuilt.subscribe((value) => {
		status = value;
	});

	onMount(async () => {
		if (view === 'all') {
			masterIndex = CollectionBuilder.getMasterIndex();
		}
	});

	function onClickTable(collection, tablesGroupKey, tableName) {
		CollectionBuilder.getRoll(collection, tablesGroupKey, tableName.toString()).then((res) => {
			choiceArray = [...choiceArray, res];
		});
	}
</script>

<svelte:head>
	<title>Tables</title>
</svelte:head>

<div class="content">
	<div class="aside">
		{#if status === STATUS.BUILT}
			<CollectionBar>
				{#each Object.keys(masterIndex) as collection}
					<CollectionExpansion
						title={masterIndex[collection].collectionName}
						choices={masterIndex[collection].tablesData}
						onClick={(groupkey, tableName) => onClickTable(collection, groupkey, tableName)}
					/>
				{/each}
			</CollectionBar>
		{:else}
			<b>Building indexes....</b>
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
