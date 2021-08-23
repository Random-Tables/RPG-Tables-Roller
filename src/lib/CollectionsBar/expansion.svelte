<script lang="ts">
	// import Chevron from 'svelte-feather-icons/src/icons/ChevronDownIcon';

	let isExpanded = false;
	export let title: string;
	export let choices;
	export let onClick: Function;

	console.log('>>choices', choices);
</script>

<div class="title"><h2>{title}</h2></div>
{#each Object.keys(choices) as choiceKey}
	<h4>{choiceKey}</h4>
	{#each choices[choiceKey].tablesList as tableName}
		<ul>
			<li>
				<button on:click={() => onClick(choiceKey, tableName)}>{tableName}</button>
			</li>
		</ul>
	{/each}
{/each}

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
