<script lang="ts">
	export let choice: Choice;
	// export let key: string;
	// export let rerollFunc: (key: string, keep: Array<boolean>) => void;
</script>

<div class="choice">
	{#if choice.type === 'string'}
		<div class="string">
			{#each choice.data as values}
				<p>
					{#each values as valueTuple, tupleIndex}
						{#if tupleIndex % 2 === 0}
							<b>{valueTuple}</b>
						{:else}
							<span>{valueTuple}</span><br />
						{/if}
					{/each}
				</p>
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
