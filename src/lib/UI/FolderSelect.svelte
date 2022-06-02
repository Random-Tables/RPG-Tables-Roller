<script lang="ts">
	import ProjectBuilder, { ProjectDataStore, selectedProjFolderStore } from '$lib/ProjectBuilder';
	import { onMount } from 'svelte';

	let folderIndex = [];

	onMount(() => {
		folderIndex = ProjectBuilder.getFolderIndexing();
	});

	function onSelect(ev) {
		ProjectBuilder.setSelectedProjFolder(ev.target.value);
	}

	ProjectDataStore.subscribe(() => {
		folderIndex = ProjectBuilder.getFolderIndexing();
	});
</script>

{#if folderIndex && folderIndex.length > 0}
	<div class="folder-select">
		<label for="folders">Select Save Folder</label>

		<select name="folders" id="select-folders" on:change={onSelect} value={$selectedProjFolderStore}>
			{#each folderIndex as folder}
				<option value={folder.value}>{folder.text}</option>
			{/each}
		</select>
	</div>
{/if}
