<script>
	import { ErrorArray } from '$lib/CollectionsBuilder';
</script>

{#if $ErrorArray.length > 0}
	<h4 class="error">Errors found during setup</h4>
	<ul>
		{#each $ErrorArray as errorString}
			<li>{errorString}</li>
		{/each}
	</ul>
{/if}

<style>
	h4.error {
		color: indianred;
	}
    li {
        margin-bottom: 0.4rem;
    }
</style>
