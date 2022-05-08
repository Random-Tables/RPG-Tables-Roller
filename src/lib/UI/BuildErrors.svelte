<script>
	import { ErrorArray } from '$lib/CollectionsBuilder';
</script>

{#if $ErrorArray}
	<h4>Errors found during setup</h4>
	<ul>
		{#each $ErrorArray as errorString}
			<li>{errorString}</li>
		{/each}
	</ul>
{/if}

<style>
	h4 {
		color: indianred;
	}
    li {
        margin-bottom: 0.4rem;
    }
</style>
