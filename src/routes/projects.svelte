<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import ProjectBuilder from '$lib/ProjectBuilder';
	import CollectionBuilder from '$lib/CollectionsBuilder';
	import { STATUS, CHOICE_TYPE } from '$lib/enums';
	import Card from '$lib/card/index.svelte';

	let Projects: projList;
	let isGettingProjFile = false;

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
</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

<h3>Select a project</h3>

{#if isGettingProjFile}
	<h3>Loading</h3>
{:else if Projects}
	{#each Projects as proj}
		<div on:click={() => onSelectProject(proj)}>
			<Card flex="0 1 35%"><p>{proj.name}</p></Card>
		</div>
	{/each}
{/if}
