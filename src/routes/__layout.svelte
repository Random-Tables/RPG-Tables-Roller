<script>
	import Header from '$lib/Header/index.svelte';
	import '../app.css';
	import '../themes/fantasy.css';
</script>

<div class="theme-fantasy">
	<Header />

	<main>
		<slot />
	</main>
</div>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
