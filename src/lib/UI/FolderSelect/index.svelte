<script lang="ts">
	import ProjectBuilder from '$lib/ProjectBuilder';
    export let folderKeys: Array<folderKey>;
    
    function onSelect(ev) {
        ProjectBuilder.setSelectedProjFolder( ev.target.value);
    }
</script>

{#if ProjectBuilder.getFolderKeys()}
<div class="folder-select">
	<label for="folders">Select Save Folder</label>

	<select name="folders" id="select-folders" on:change={onSelect}>
		{#each ProjectBuilder.getFolderKeys() as folder}
			<option value={folder.value}>{folder.text}</option>
		{/each}
	</select>
</div>
{/if}
