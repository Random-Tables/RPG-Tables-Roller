<script lang="ts">
	import ProjectBuilder from '$lib/ProjectBuilder';
	import { STATUS } from '$lib/enums';
	import { onMount, afterUpdate } from 'svelte';
	import FolderExpander from '$lib/UI/ProjFolderExpander/index.svelte';
	import ChoiceBox from '$lib/Viewer/choicebox.svelte';

	let projectData: projData;
	let projectKeys;
	let choiceArray: Array<Choice> = [];
	let keyChoice;
	let keyString: '';

	onMount(() => {
		if (ProjectBuilder.getProjectStatus() === STATUS.BUILT) {
			projectData = ProjectBuilder.getProject();
			projectKeys = ProjectBuilder.getProjectKeys();
		} else {
			console.log('projects not built');
		}
	});

	function onClickFolder(key) {
		const keys = key.split(ProjectBuilder.SEPERATOR);
		keyChoice = key;
		keyString = keys[0];

		if (keys.length === 2) {
			keyString += '/' + keys[1];
			choiceArray = projectKeys[keys[0]].subfolderKeys[keys[1]];
		} else if (keys.length === 1) {
			choiceArray = projectKeys[keys[0]].data;
		}
	}

	const removeChoiceRoll = (itemIndex, subItemIndex) => {
		if (choiceArray[itemIndex].data.length === 1) {
			choiceArray = choiceArray.filter((item, i) => i !== itemIndex);
		} else {
			const newChoiceArray = choiceArray.slice();
			newChoiceArray[itemIndex].data.splice(subItemIndex, 1);
			choiceArray = newChoiceArray;
		}
	};

	function setDefaultFolder(key) {
		ProjectBuilder.setSelectedProjFolder(key);
	}
</script>

{#if projectData}
	<h3>{projectData.name}</h3>
	<p><b>Last Edited</b> {projectData.lastEdit}</p>
	{#if keyString !== ''}
		<button on:click={() => setDefaultFolder(keyChoice)}>Set {keyString} as default folder</button>
	{/if}

	<div class="wrap-proj-data">
		<div class="wrap-proj-folders">
			{#each projectData.folders as folder}
				<FolderExpander {folder} {onClickFolder} />
			{/each}
		</div>
		<div class="wrap-proj-choices">
			<h4>CHOICES</h4>
			{#if choiceArray}
				{#each choiceArray as choice, index}
					<ChoiceBox {choice} {index} {removeChoiceRoll} />
				{/each}
			{/if}
		</div>
	</div>
{:else}
	<h3>No project Data Found</h3>
{/if}

<style>
	.wrap-proj-data {
		flex-grow: 1;
		border: 2px solid black;
		display: flex;
	}
	.wrap-proj-folders {
		border: 1px solid lightblue;
		flex: 3 0 25%;
	}
	.wrap-proj-choices {
		border: 1px solid lightcoral;
		flex: 8 8 70%;
		padding: 10px;
	}
</style>
