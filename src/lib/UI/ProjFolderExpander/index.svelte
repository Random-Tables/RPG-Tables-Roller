<script lang="ts">
	import ProjectBuilder from '$lib/ProjectBuilder';
	import AddProjFolder from '$lib/AddProjFolder/index.svelte';

	export let folder: projFolder;
	export let onClickFolder: Function;
	export let folderIndex: number;
	export let onAddFolderComplete: Function;

	let subfoldersOpen = false;

	function toggleSubfolders() {
		subfoldersOpen = !subfoldersOpen;
	}
</script>

<div>
	<div class="folder-header">
		<div
			on:click={() => {
				onClickFolder(folderIndex + '', folder.name);
			}}
		>
			<b>{folder.name}</b>
		</div>
		<div>
			{#if folder.subfolders}
				<button class="expand" on:click={toggleSubfolders}>V</button>
			{/if}
			<button class="dropdown">:</button>
		</div>
	</div>
	{#if folder.subfolders && subfoldersOpen}
		{#each folder.subfolders as subfolder, subFolderIndex}
			<div class="subfolder-header">
				<div
					on:click={() => {
						onClickFolder(folderIndex + ProjectBuilder.SEPERATOR + subFolderIndex, subfolder.name);
					}}
				>
					<b>{subfolder.name}</b>
				</div>
				<button class="dropdown">:</button>
			</div>
		{/each}
		<AddProjFolder {folderIndex} onComplete={onAddFolderComplete} />
	{/if}
</div>

<style>
	.subfolder-header,
	.folder-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 5px;
	}
	.subfolder-header b,
	.folder-header b {
		cursor: pointer;
	}
	.folder-header {
		background: rgba(92, 138, 163, 0.35);
	}
</style>
