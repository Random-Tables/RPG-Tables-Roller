<script lang="ts">
	import Modal from '$lib/UI/modal.svelte';
	import ProjectBuilder from '$lib/ProjectBuilder';

	export let showDeleteModal;
	export let folderIndex;
	export let subFolderIndex;
	export let onClose: Function;

	function deleteFolder() {
        console.log('folderIndex', folderIndex);
        console.log('subFolderIndex', subFolderIndex);
		ProjectBuilder.deleteFolder(folderIndex, subFolderIndex);
		onClose();
	}
</script>

{#if showDeleteModal}
	<Modal on:close={() => onClose()}>
		<h2 slot="header">Delete Folder?</h2>
		<div class="flextable">
			<button on:click={() => onClose()} class="first--button">Cancel</button>
			<button on:click={deleteFolder} class="delete--button">Delete</button>
		</div>
	</Modal>
{/if}

<style>
	button.first--button {
		margin-right: 2rem;
	}
	button.delete--button {
		background-color: indianred;
		color: white;
	}
</style>
