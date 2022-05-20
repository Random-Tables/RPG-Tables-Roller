<script lang="ts">
	export let title: string;
	export let onClick: Function;
	export let choiceTables: Array<string>;
	export let choiceGroup: string;

	let expanded = true;

	function switchExpansion() {
		expanded = !expanded;
	}
</script>

<div class="title"><h2>{title}</h2></div>

<div class="flextable-between">
	<h4>{choiceGroup}</h4>
	<button on:click={switchExpansion}>{expanded ? '▲' : '▼'}</button>
</div>

{#if expanded}
	<ul>
		{#each choiceTables as tableName}
			<li>
				<button on:click={() => onClick(choiceGroup, tableName)}>{tableName}</button>
			</li>
		{/each}
	</ul>
{/if}

<style>
	h2 {
		padding: 5px;
		border: 1px solid grey;
		margin: 0;
		background: lightblue;
		color: white;
		font-weight: bold;
	}
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
	li button {
		padding: 5px;
		border-radius: 0px;
		width: 100%;
		margin: 0px;
		text-align: left;
		border: 1px solid transparent;
		background: white;
		cursor: pointer;
	}
	li button:hover {
		background: lightcoral;
	}
</style>
