<script lang="ts">
	import ChoiceBox from './choicebox.svelte';

	export let choices: Array<Choice>;
	export let clearChoices;
	export let clearChoiceItem;
	export let removeChoiceRoll;
	export let newChoiceRoll;
</script>

<div class="viewer">
	{#each choices as choice, index}
		<ChoiceBox {choice} {index} {clearChoiceItem} {removeChoiceRoll} {newChoiceRoll} />
	{/each}
</div>
{#if choices.length > 1}
	<button on:click={clearChoices}>Clear All</button>
{/if}

<style>
	.viewer {
		border: 1px solid black;
		padding: 10px;
		margin: 0 1rem;
		border-radius: 5px;
		max-height: calc(100vh - 200px);
		overflow-x: scroll;
	}
</style>
