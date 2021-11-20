<script lang="ts">
	import ProjectBuilder from '$lib/ProjectBuilder';
	import { STATUS } from '$lib/enums';
	import { onMount } from 'svelte';
	import FolderExpander from '$lib/UI/ProjFolderExpander/index.svelte';

	let projectData: projData;

	let isLoaded = false;
	onMount(() => {
		if (ProjectBuilder.getProjectStatus() === STATUS.BUILT) {
			projectData = ProjectBuilder.getProject();
		} else {
			console.log('projects not built');
		}
	});

	function onClickFolder(key) {
		console.log('key', key);
		console.log('KEYS', key.split(ProjectBuilder.SEPERATOR));
	}
</script>

{#if projectData}
	<h3>{projectData.name}</h3>
	<p><b>Last Edited</b> {projectData.lastEdit}</p>

	<div class="wrap-proj-data">
		<div class="wrap-proj-folders">
			{#each projectData.folders as folder}
				<FolderExpander {folder} {onClickFolder} />
			{/each}
		</div>
		<div class="wrap-proj-choices">CHOICES</div>
	</div>
{:else}
	<h3>No project Data Found</h3>
{/if}

<style>
	.wrap-proj-data {
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
	}
</style>
