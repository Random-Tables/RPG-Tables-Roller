<script lang="ts">
	export let onClick: Function;
	export let choiceTables: Array<string>;
	export let choiceGroup: string;

	let expanded = false;

	function switchExpansion() {
		expanded = !expanded;
	}
</script>


<div class="flextable-between">
	<h4>{choiceGroup}</h4>
	<button on:click={switchExpansion}>{expanded ? '▲' : '▼'}</button>
</div>

{#if expanded}
	<ul>
		{#each choiceTables as tableName}
			<li class="expand-item">
				<button on:click={() => onClick(choiceGroup, tableName)}>{tableName}</button>
			</li>
		{/each}
	</ul>
{/if}

<style>
	h4 {
		margin: 0;
		padding: 5px;
		border: none;
		border-bottom: 1px solid grey;
	}
	ul {
		list-style: none;
		padding: 0px;
		margin: 0px;
	}
	li.expand-item {
		width: 100%;
		margin-bottom: 0.2rem;
	}
	li.expand-item button {
		padding: 5px;
		border-radius: 0px;
		width: 100%;
		margin: 0px;
		text-align: left;
		border: 1px solid transparent;
		cursor: pointer;
	}
	li button:hover {
		background: lightcoral;
	}
</style>
