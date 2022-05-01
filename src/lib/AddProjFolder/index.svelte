<script lang="ts">
	import ProjectBuilder from '$lib/ProjectBuilder';

	export let folderIndex: number = null;
	export let onComplete: Function;

	let newFolderName = '';
	let addFolderError = '';
	let disableAddNew = true;

	async function addFolder() {
		addFolderError = '';
		disableAddNew = true;
		const addedFolder = ProjectBuilder.addFolderToProject(newFolderName, folderIndex);
		if (!addedFolder) addFolderError = 'Name Already Exists';
		newFolderName = '';
		disableAddNew = false;
        onComplete();
	}

	function checkName() {
		addFolderError = '';
		if (newFolderName.length > 0) {
			disableAddNew = false;
		} else {
			disableAddNew = true;
		}
	}
</script>

<div>
	<label for="projName">New:</label>
	<input id="projName" bind:value={newFolderName} on:keyup={checkName} type="text" />
	<div class="flextable">
		<button on:click={addFolder} disabled={disableAddNew}>Add Project</button>
		<h5>{addFolderError}</h5>
	</div>
</div>

<style>
	h5 {
		margin: 0.5rem 1rem;
		color: indianred;
	}
</style>
