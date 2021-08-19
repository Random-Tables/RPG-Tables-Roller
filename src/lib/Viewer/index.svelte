<script lang="ts">
	import ChoiceBox from './choicebox.svelte';

	export let choices: Array<Choice>;
	console.log('>>choices', choices);
</script>

<div class="viewer">
	{#each choices as choice}
		<ChoiceBox {choice} />
	{/each}

	{#if choices.length > 1}
		<button>Clear All</button>
	{/if}
</div>

<style>
	.viewer {
		border: 1px solid black;
		padding: 10px;
		margin: 10px;
		width: calc(100% - 20px);
	}
</style>
