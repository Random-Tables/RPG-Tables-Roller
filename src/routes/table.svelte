<script lang="ts">
	import { onMount } from 'svelte';
	import CollectionBuilder from '$lib/CollectionsBuilder';
	import ProjectBuilder from '$lib/ProjectBuilder';
	import { STATUS } from '$lib/enums';
	import Viewer from '$lib/Viewer/index.svelte';
	import { viewsBuilt, choiceArrayStore } from '$lib/stores';
	import CollectionExpansion from '$lib/CollectionsBar/expansion.svelte';
	import CategoryBar from '$lib/UI/Categorybar.svelte';
	import FolderSelect from '$lib/UI/FolderSelect.svelte';
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
				choiceArrayStore.update((arr) => [...arr, res]);
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
				newChoiceArray[itemIndex].data[subItemIndex] = res.data[0];
			} else {
				newChoiceArray[itemIndex].data.push(res.data[0]);
			}

			choiceArrayStore.set(newChoiceArray);
		});
	};

	function addSingleChoiceToProj(choiceIndex: number, subChoice: number) {
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
			<div class="collection-bar">
				{#each Object.keys(index) as collection}
					{#each Object.keys(index[collection].tablesData) as choiceGroup}
						<CollectionExpansion
							title={index[collection].collectionName}
							{choiceGroup}
							choiceTables={index[collection].tablesData[choiceGroup].tablesList}
							onClick={(groupkey, tableName) => onClickTable(collection, groupkey, tableName)}
						/>
					{/each}
				{/each}
			</div>
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
	.viewer {
		flex: 3 1 50%;
	}
</style>
