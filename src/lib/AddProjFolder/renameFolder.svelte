<script lang="ts">
	import Modal from '$lib/UI/modal.svelte';
	import ProjectBuilder from '$lib/ProjectBuilder';

	export let showRenameModal;
	export let subFolderIndex = null;
	export let folderIndex;
	export let onClose: Function;
	export let newFolderName = '';

	let renameFolderError = '';
	let disableRenameFolder = true;

	function renameFolder() {
		renameFolderError = '';
		const response = ProjectBuilder.renameFolder(newFolderName, folderIndex, subFolderIndex);
		renameFolderError = response;
		newFolderName = '';
		onClose();
	}

	function checkName() {
		renameFolderError = '';
		if (newFolderName.length > 0) {
			disableRenameFolder = false;
		} else {
			disableRenameFolder = true;
		}
	}
</script>

{#if showRenameModal}
	<Modal on:close={() => onClose()}>
		<h2 slot="header">Rename Folder?</h2>
		<label for="folderRename">New Name:</label>
		<input id="folderRename" bind:value={newFolderName} on:keyup={checkName} type="text" />
		<div class="flextable">
			<button on:click={renameFolder} disabled={disableRenameFolder}>Rename</button>
			<h5>{renameFolderError}</h5>
		</div>
	</Modal>
{/if}
