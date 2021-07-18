<script lang="ts">
	export let flex: string;
	export let href: string;
</script>

{#if href}
	<a sveltekit:prefetch {href} style="flex: {flex}" class="wrapper">
		<slot />
	</a>
{:else}
	<div class="wrapper" style="flex: {flex}"><slot /></div>
{/if}

<style>
	.wrapper {
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
