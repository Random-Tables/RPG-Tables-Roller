<script lang="ts">
	import ProjectBuilder from '$lib/ProjectBuilder';
	import AddProjFolder from '$lib/AddProjFolder/index.svelte';
	import Menu from '$lib/UI/hovermenu.svelte';
	import MenuItem from '$lib/UI/hovermenuItem.svelte';
	import RenameFolder from '$lib/AddProjFolder/renameFolder.svelte';
	import DeleteFolder from '$lib/AddProjFolder/deleteFolder.svelte';

	export let folder: projFolder;
	export let onClickFolder: Function;
	export let folderIndex: number;
	export let onAddFolderComplete: Function;

	let showRenameModal = false;
	let subfoldersOpen = false;
	let renameFolderIndex;
	let renameSubFolderIndex = null;
	let renameFolderOriginalName = '';

	let showDeleteModal = false;

	function toggleSubfolders() {
		subfoldersOpen = !subfoldersOpen;
	}

	function setShowRenameModal(
		originalName: string,
		setFolderIndex: number,
		setSubFolderIndex?: number
	) {
		renameFolderIndex = setFolderIndex;
		renameFolderOriginalName = originalName;
		if (setSubFolderIndex || setSubFolderIndex === 0) {
			renameSubFolderIndex = setSubFolderIndex;
		} else {
			renameSubFolderIndex = null;
		}
		showRenameModal = true;
	}

	function setShowDeleteModal(setFolderIndex: number, setSubFolderIndex?: number) {
		renameFolderIndex = setFolderIndex;
		if (setSubFolderIndex || setSubFolderIndex === 0) {
			renameSubFolderIndex = setSubFolderIndex;
		} else {
			renameSubFolderIndex = null;
		}
		showDeleteModal = true;
	}
</script>

<RenameFolder
	{showRenameModal}
	onClose={() => (showRenameModal = false)}
	folderIndex={renameFolderIndex}
	subFolderIndex={renameSubFolderIndex}
	newFolderName={renameFolderOriginalName}
/>

<DeleteFolder
	{showDeleteModal}
	onClose={() => (showDeleteModal = false)}
	folderIndex={renameFolderIndex}
	subFolderIndex={renameSubFolderIndex}
/>

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
			<button class="expand" on:click={toggleSubfolders}>{subfoldersOpen ? '▲' : '▼'}</button>

			<Menu>
				<div class="dropdown" slot="toggle">:</div>
				<MenuItem
					><button class="drop-rename" on:click={() => setShowRenameModal(folder.name, folderIndex)}
						>Rename</button
					></MenuItem
				>
				<MenuItem
					><button class="drop-delete" on:click={() => setShowDeleteModal(folderIndex)}
						>Delete</button
					></MenuItem
				>
			</Menu>
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
				<Menu>
					<button class="dropdown" slot="toggle">:</button>
					<MenuItem
						><button
							class="norm"
							on:click={() => setShowRenameModal(subfolder.name, folderIndex, subFolderIndex)}
							>Rename</button
						></MenuItem
					>
					<MenuItem
						><button class="norm" on:click={() => setShowDeleteModal(folderIndex, subFolderIndex)}
							>Delete</button
						></MenuItem
					>
				</Menu>
			</div>
		{/each}
	{/if}
	{#if subfoldersOpen}
		<AddProjFolder {folderIndex} onComplete={onAddFolderComplete} isSubfolder={true} />
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
	button.drop-delete,
	button.drop-rename {
		border: 0;
		border-radius: 0;
		padding: 0;
		background: none;
		padding: 0.5rem;
		cursor: pointer;
		width: 100%;
	}
</style>
