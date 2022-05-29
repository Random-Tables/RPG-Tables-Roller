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
	a {
		cursor: pointer;
	}
</style>
