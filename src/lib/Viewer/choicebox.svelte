<script lang="ts">
	export let choice: Choice;
	export let index: number;
	export let clearChoiceItem;
	export let removeChoiceRoll;
	export let newChoiceRoll;
</script>

<div class="choice">
	{#if choice.type === 'string'}
		<div class="string-wrap">
			{#each choice.data as values, rollIndex}
				<div class="string">
					<p>
						{#each values as valueTuple, tupleIndex}
							{#if tupleIndex % 2 === 0}
								<b>{valueTuple}</b>
							{:else}
								<span>{valueTuple}</span><br />
							{/if}
						{/each}
					</p>
					<div class="options">
						{#if newChoiceRoll}
							<button on:click={() => newChoiceRoll(true, choice.call, index, rollIndex)}>RR</button
							>
							<button>Save</button>
						{/if}
						<button on:click={() => removeChoiceRoll(index, rollIndex)}>X</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	<div class="roll-options">
		{#if newChoiceRoll}
			<button on:click={() => newChoiceRoll(false, choice.call, index)}>+</button>
		{/if}
		{#if choice.data.length > 1 && clearChoiceItem}
			<button on:click={() => clearChoiceItem(index)}>X</button>
		{/if}
	</div>
</div>

<style>
	.choice {
		border: 1px solid darkgray;
		display: flex;
		justify-content: space-between;
	}
	.string-wrap {
		flex: 1 1 100%;
	}
	.string {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}
	.options {
		margin-top: 1rem;
		margin-right: 1rem;
	}
</style>
