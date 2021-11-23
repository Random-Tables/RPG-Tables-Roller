<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
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
	let choiceArray: Array<Choice> = [];

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
		CollectionBuilder.getRoll(collection, tablesGroupKey, tableName.toString(), isUtility).then(
			(res) => {
				if (isUtility) {
					choiceArray = [
						...choiceArray,
						{
							data: [['Utility:', res.utility]],
							call: {
								collection,
								tablesGroupKey,
								tableName
							},
							type: CHOICE_TYPE.string
						}
					];
				} else {
					choiceArray = [...choiceArray, res];
				}
			}
		);
	}
	function onClickCategory(newCategory) {
		category = newCategory;
		index = generalIndex.categories[category];
	}
	const clearChoices = () => {
		choiceArray = [];
	};
	const clearChoiceItem = (index) => {
		choiceArray = choiceArray.filter((item, i) => i !== index);
	};
	const removeChoiceRoll = (itemIndex, subItemIndex) => {
		if (choiceArray[itemIndex].data.length === 1) {
			clearChoiceItem(itemIndex);
		} else {
			const newChoiceArray = choiceArray.slice();
			newChoiceArray[itemIndex].data.splice(subItemIndex, 1);
			choiceArray = newChoiceArray;
		}
	};
	const newChoiceRoll = (isReRoll, call: ChoiceCall, itemIndex, subItemIndex?) => {
		const isUtility = category === 'utility';
		const newChoiceArray = choiceArray.slice();
		CollectionBuilder.getRollWithCall(call, isUtility).then((res) => {
			if (isReRoll) {
				if (isUtility) {
					newChoiceArray[itemIndex].data[subItemIndex] = ['Utility:', res.utility];
				} else {
					newChoiceArray[itemIndex].data[subItemIndex] = res.data[0];
				}
			} else {
				if (isUtility) {
					newChoiceArray[itemIndex].data.push(['Utility:', res.utility]);
				} else {
					newChoiceArray[itemIndex].data.push(res.data[0]);
				}
			}
			choiceArray = newChoiceArray;
		});
	};
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
		<Viewer
			choices={choiceArray}
			{clearChoices}
			{clearChoiceItem}
			{removeChoiceRoll}
			{newChoiceRoll}
		/>
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
