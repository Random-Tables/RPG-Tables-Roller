<script>
	import { LoadedArray } from '$lib/CollectionsBuilder';

	let expanded = false;

	function switchExpansion() {
		expanded = !expanded;
	}
</script>

{#if $LoadedArray}
	<div class="wrapper">
		<div class="flextable-between">
			<h4>Loaded Collections</h4>
			<button on:click={switchExpansion}>{expanded ? '▲' : '▼'}</button>
		</div>
		{#if expanded}
			<ul>
				{#each $LoadedArray as collectionString, index}
					<li>{collectionString} {index + 1 === $LoadedArray.length ? '' : ', '}</li>
				{/each}
			</ul>
		{/if}
	</div>
{/if}

<style>
	.wrapper {
		padding: 1rem;
		border: 1px solid darkgray;
		border-radius: 0.4rem;
		min-width: 80%;
		margin: 1rem auto;
	}
	h4 {
		margin: 0;
	}
	ul {
		display: inline-block;
		padding-inline-start: 0;
	}
	li {
		display: inline;
		margin-bottom: 0.4rem;
	}
</style>
