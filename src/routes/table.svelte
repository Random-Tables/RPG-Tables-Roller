<script lang="ts">
	import { onMount } from 'svelte';
	import CollectionBuilder from '$lib/CollectionsBuilder';
	import ProjectBuilder from '$lib/ProjectBuilder';
	import { STATUS, CHOICE_TYPE } from '$lib/enums';
	import Viewer from '$lib/Viewer/index.svelte';
	import { viewsBuilt, choiceArrayStore } from '$lib/stores';
	import CollectionBar from '$lib/CollectionsBar/index.svelte';
	import CollectionExpansion from '$lib/CollectionsBar/expansion.svelte';
	import CategoryBar from '$lib/CategoryBar/index.svelte';
	import FolderSelect from '$lib/UI/FolderSelect/index.svelte';
	import { get } from 'svelte/store';

	let status = STATUS.UNSTARTED;
	let generalIndex;
	let index;
	let categoryList = [];
	let category = 'all';
	let projSelected = false;

	viewsBuilt.subscribe((value) => {
		status = value;
	});

	onMount(async () => {
		generalIndex = CollectionBuilder.getMGeneralIndex();
		index = generalIndex.categories[category];
		categoryList = Object.keys(generalIndex.categories);
		projSelected = ProjectBuilder.getProjectStatus() === STATUS.BUILT;
	});

	function onClickTable(collection, tablesGroupKey, tableName) {
		const isUtility = category === 'utility';
		CollectionBuilder.getRoll(collection, tablesGroupKey, tableName.toString(), isUtility).then(
			(res) => {
				if (isUtility) {
					choiceArrayStore.update((arr) => [
						...arr,
						{
							data: [['Utility:', res.utility]],
							call: {
								collection,
								tablesGroupKey,
								tableName
							},
							type: CHOICE_TYPE.string
						}
					]);
				} else {
					choiceArrayStore.update((arr) => [...arr, res]);
				}
			}
		);
	}
	function onClickCategory(newCategory) {
		category = newCategory;
		index = generalIndex.categories[category];
	}
	const clearChoices = () => {
		choiceArrayStore.set([]);
	};
	const clearChoiceItem = (index) => {
		choiceArrayStore.update((arr) => arr.filter((item, i) => i !== index));
	};
	const removeChoiceRoll = (itemIndex, subItemIndex) => {
		if (get(choiceArrayStore)[itemIndex].data.length === 1) {
			clearChoiceItem(itemIndex);
		} else {
			choiceArrayStore.update((arr) => {
				const newChoiceArray = arr.slice();
				newChoiceArray[itemIndex].data.splice(subItemIndex, 1);
				return newChoiceArray;
			});
		}
	};
	const newChoiceRoll = (isReRoll, call: ChoiceCall, itemIndex, subItemIndex?) => {
		const isUtility = category === 'utility';

		const newChoiceArray = get(choiceArrayStore).slice();

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

			choiceArrayStore.set(newChoiceArray);
		});
	};

	function addSingleChoiceToProj(choiceIndex: number, subChoice: number ) {
		const choices = get(choiceArrayStore);
		ProjectBuilder.addRollToProject(choices[choiceIndex], subChoice);
	}
</script>

<svelte:head>
	<title>Tables</title>
</svelte:head>

{#if projSelected}
	<FolderSelect />
{/if}

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
			{projSelected}
			choices={$choiceArrayStore}
			{clearChoices}
			{clearChoiceItem}
			{removeChoiceRoll}
			{newChoiceRoll}
			{addSingleChoiceToProj}
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
