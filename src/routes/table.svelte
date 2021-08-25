<script lang="ts">
	import { browser } from '$app/env';
	export const router = browser;
	import { onMount } from 'svelte';
	import CollectionBuilder from '$lib/CollectionsBuilder';
	import { STATUS, CHOICE_TYPE } from '$lib/enums';
	import Viewer from '$lib/Viewer/index.svelte';
	import { viewsBuilt } from '$lib/stores';
	import CollectionBar from '$lib/CollectionsBar/index.svelte';
	import CollectionExpansion from '$lib/CollectionsBar/expansion.svelte';
	import CategoryBar from '$lib/CategoryBar/index.svelte';

	let status = STATUS.UNSTARTED;
	let generalIndex;
	let index;
	let categoryList = [];
	let view = 'all';
	let category = 'all';
	let choiceArray: Array<Choice | string> = [];
	viewsBuilt.subscribe((value) => {
		status = value;
	});

	onMount(async () => {
		if (view === 'all') {
			generalIndex = CollectionBuilder.getMGeneralIndex();
			index = generalIndex.categories[category];
			categoryList = Object.keys(generalIndex.categories);
		}
	});

	function onClickTable(collection, tablesGroupKey, tableName) {
		const isUtility = category === 'utility';
		console.log("isUtility", isUtility);
		CollectionBuilder.getRoll(collection, tablesGroupKey, tableName.toString(), isUtility).then((res) => {
			console.log("res", res)
			if (isUtility) {
				choiceArray = [
					...choiceArray,
					{
						data: [['Utility:', res.toString()]],
						type: CHOICE_TYPE.string
					}
				];
				console.log("1", {
						data: [['Utility:', res.toString()]],
						type: CHOICE_TYPE.string
					})
			} else {
				choiceArray = [...choiceArray, res];
			}
		});
	}
	function onClickCategory(newCategory) {
		category = newCategory;
		index = generalIndex.categories[category];
	}
</script>

<svelte:head>
	<title>Tables</title>
</svelte:head>

<CategoryBar currentCategory={category} {categoryList} onSelect={onClickCategory} />
<div class="content">
	<div class="collections">
		{#if status === STATUS.BUILT && index}
			<CollectionBar>
				{#each Object.keys(index) as collection}
					<CollectionExpansion
						title={index[collection].collectionName}
						choices={index[collection].tablesData}
						onClick={(groupkey, tableName) => onClickTable(collection, groupkey, tableName)}
					/>
				{/each}
			</CollectionBar>
		{:else}
			<b>Building indexes....</b>
		{/if}
	</div>
	<div class="viewer">
		<Viewer choices={choiceArray} />
	</div>
</div>

<style>
	.content {
		width: 100%;
		margin: var(--column-margin-top) auto 0 auto;
		display: flex;
	}
	.collections {
		flex: 1 0 200px;
	}
	.viewer {
		flex: 3 1 50%;
	}
</style>
