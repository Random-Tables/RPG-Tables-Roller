<script lang="ts">
	import ProjectBuilder, { ProjectDataStore } from '$lib/ProjectBuilder';
	import { STATUS } from '$lib/enums';
	import { onMount, afterUpdate } from 'svelte';
	import FolderExpander from '$lib/UI/ProjFolderExpander/index.svelte';
	import ChoiceBox from '$lib/Viewer/choicebox.svelte';
	import AddProjFolder from '$lib/AddProjFolder/index.svelte';

	let projectData: projData;
	let choiceArray: Array<Choice> = [];
	let keyChoice;
	let keyString: '';

	function updateProj() {
		projectData = ProjectBuilder.getProject();
	}

	function setupData() {
		if (ProjectBuilder.getProjectStatus() === STATUS.BUILT) {
			updateProj();
		} else {
			console.error('projects not built');
		}
	}

	onMount(() => {
		setupData();
	});
	afterUpdate(() => {
		setupData();
	});
	ProjectDataStore.subscribe(() => {
		setupData();
	});

	function updateChoiceArray() {
		const keys = keyChoice.split(ProjectBuilder.SEPERATOR);

		const keyA = parseInt(keys[0], 10);

		if (keys.length === 2) {
			const keyB = parseInt(keys[1], 10);
			choiceArray = projectData.folders[keyA].subfolders[keyB].data as Choice[];
		} else if (keys.length === 1) {
			choiceArray = projectData.folders[keyA].data as Choice[];
		}
	}
	function onClickFolder(key, name) {
		keyChoice = key;
		keyString = name;

		updateChoiceArray();
	}

	const removeChoiceRoll = (itemIndex, subItemIndex) => {
		ProjectBuilder.removeRoll(itemIndex, subItemIndex, keyChoice);
		updateChoiceArray();
	};

	function setDefaultFolder() {
		ProjectBuilder.setSelectedProjFolder(keyChoice);
	}
</script>

{#if projectData}
	<h3>{projectData.name}</h3>
	<p><b>Last Edited</b> {projectData.lastEdit}</p>
	{#if keyString && keyString !== ''}
		<button class="project-set-default" on:click={setDefaultFolder}>Set {keyString} as default folder</button>
	{/if}

	<div class="wrap-proj-data">
		<div class="wrap-proj-folders">
			{#each projectData.folders as folder, index}
				<FolderExpander
					{folder}
					{onClickFolder}
					folderIndex={index}
					onAddFolderComplete={updateProj}
				/>
			{/each}
			<AddProjFolder onComplete={updateProj} />
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
