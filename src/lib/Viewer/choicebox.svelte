<script lang="ts">
	export let choice: Choice;
	export let index: number;
	export let clearChoiceItem: Function = null;
	export let removeChoiceRoll: Function = null;
	export let newChoiceRoll: Function = null;
	export let addSingleChoiceToProj: Function = null;
	export let projSelected = false;
</script>

<div class="choice">
	{#if choice.type === 'string'}
		<div class="string-wrap">
			{#each choice.data as choiceRolls, rollIndex}
				<div class="string">
					<div>
						{#each choiceRolls as choiceData}
							<div class={choiceData.class}>
								<b>{choiceData.title}</b>
								<span>{choiceData.data}</span>
							</div>
						{/each}
					</div>
					<div class="options">
						{#if newChoiceRoll}
							<button on:click={() => newChoiceRoll(true, choice.call, index, rollIndex)}>RR</button
							>
							{#if projSelected}
								<button on:click={() => addSingleChoiceToProj(index, rollIndex)}>Save</button>
							{/if}
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
