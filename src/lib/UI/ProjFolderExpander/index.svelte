<script lang="ts">
	import ProjectBuilder from '$lib/ProjectBuilder';
	export let folder: projFolder;
	export let onClickFolder: Function;

	let subfoldersOpen = false;

	function toggleSubfolders() {
		subfoldersOpen = !subfoldersOpen;
	}
</script>

<div>
	<div class="folder-header">
		<div
			on:click={() => {
				onClickFolder(folder.name);
			}}
		>
			<h5>{folder.name}</h5>
		</div>
		<div>
			{#if folder.subfolders}
				<button class="expand" on:click={toggleSubfolders}>V</button>
			{/if}
			<button class="dropdown">:</button>
		</div>
	</div>
	{#if folder.subfolders && subfoldersOpen}
		{#each folder.subfolders as subfolder}
			<div>
				<div
					on:click={() => {
						onClickFolder(folder.name + ProjectBuilder.SEPERATOR + subfolder.name);
					}}
				>
					<h5>{subfolder.name}</h5>
				</div>
				<button class="dropdown">:</button>
			</div>{/each}
	{/if}
</div>

<style>
	.subfolder-header,
	.folder-header {
		display: flex;
		justify-content: space-between;
	}
</style>
