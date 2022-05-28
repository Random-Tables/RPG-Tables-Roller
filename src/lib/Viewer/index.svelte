<script lang="ts">
	import ChoiceBox from './choicebox.svelte';

	export let choices: Array<Choice>;
	export let clearChoices;
	export let clearChoiceItem;
	export let removeChoiceRoll;
	export let newChoiceRoll;
	export let addSingleChoiceToProj;
	export let projSelected;
</script>

<div class="choice-viewbox">
	{#each choices as choice, index}
		<ChoiceBox
			{projSelected}
			{choice}
			{index}
			{clearChoiceItem}
			{removeChoiceRoll}
			{newChoiceRoll}
			{addSingleChoiceToProj}
		/>
	{/each}
</div>
{#if choices.length > 1}
	<button on:click={clearChoices}>Clear All</button>
{/if}
