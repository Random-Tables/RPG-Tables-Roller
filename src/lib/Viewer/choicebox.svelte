<script lang="ts">
    export let choice: Choice;
    // export let key: string;
    // export let rerollFunc: (key: string, keep: Array<boolean>) => void;
</script>

<div class="choice">
	{#if choice.type === CHOICE_TYPE.string}
		<div class="string">
			{#each choice.values as values}
				<p>{values}</p>
			{/each}
		</div>
	{/if}
	<div />
	<button>RR</button>
</div>

<style>
	.choice {
		border: 1px solid darkgray;
		display: flex;
        justify-content: space-between;
	}
</style>
