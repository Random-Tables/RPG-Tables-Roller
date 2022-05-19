<script lang="ts">
	export let flex: string;
	export let hrefLink: string = null;
</script>

{#if hrefLink}
	<a href={hrefLink} style="flex: {flex}" class="card-item">
		<slot />
	</a>
{:else}
	<div class="card-item" style="flex: {flex}"><slot /></div>
{/if}

<style>
	.card-item {
		display: block;
		border: 1px solid grey;
		background: white;
		padding: 20px;
		border-radius: 5px;
	}
	a {
		cursor: pointer;
	}
</style>
