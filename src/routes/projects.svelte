<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import ProjectBuilder from '$lib/ProjectBuilder';
	import CollectionBuilder from '$lib/CollectionsBuilder';
	import { STATUS } from '$lib/enums';
	import Card from '$lib/card/index.svelte';

	let Projects: projList;
	let isGettingProjFile = false;
	let newProjectTitle = '';
	let disableCreateName = false;
	let disableCreateAdd = true;
	let errorMsg = '';

	onMount(async () => {
		if (CollectionBuilder.getStatus() === STATUS.BUILT) {
			Projects = CollectionBuilder.getProjects();
		} else {
			console.error('projects not built');
		}
	});

	async function onSelectProject(proj) {
		isGettingProjFile = true;
		await ProjectBuilder.buildProject(proj.path);
		isGettingProjFile = false;
		goto('/project');
	}

	async function createProject() {
		disableCreateName = true;
		disableCreateAdd = true;
		ProjectBuilder.createProject(newProjectTitle)
			.then(() => {
				errorMsg = '';
			})
			.catch((e) => {
				errorMsg = e;
			})
			.finally(async () => {
				Projects = await CollectionBuilder.getProjectsFromDisk();
				disableCreateAdd = false;
				disableCreateName = false;
			});
	}
	async function checkName() {
		if (newProjectTitle.length > 0) {
			disableCreateAdd = false;
		} else {
			disableCreateAdd = true;
		}
	}
</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

<h3>Select a project</h3>

{#if isGettingProjFile}
	<h3>Loading</h3>
{:else if Projects}
	<div class="project-list">
		{#each Projects as proj}
			<div class="project-item" on:click={() => onSelectProject(proj)}>
				<Card flex="0 1 35%"><p>{proj.name}</p></Card>
			</div>
		{/each}
	</div>
{/if}
<div class="btn-wrap">
	<h4>Create Project</h4>
	<h5>{errorMsg}</h5>
	<div>
		<label for="projName">Name:</label>
		<input
			id="projName"
			bind:value={newProjectTitle}
			on:keyup={checkName}
			type="text"
			disabled={disableCreateName}
		/>
	</div>
	<button on:click={createProject} disabled={disableCreateAdd}>Add</button>
</div>

<style>
	.btn-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1rem;
	}

	h5 {
		color: indianred;
	}
</style>
