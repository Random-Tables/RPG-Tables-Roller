<script lang="ts">
	export let currentCategory: string;
	export let categoryList: Array<string>;
	export let onSelect: Function;
</script>

<div class="wrap">
	{#each categoryList as category}
		<button class={category === currentCategory && 'active'} on:click={() => onSelect(category)}
			>{category}</button>
	{/each}
</div>
