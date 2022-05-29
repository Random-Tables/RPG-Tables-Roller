<script>
	// @ts-nocheck

	import { settingsStore } from '$lib/SettingsManager';
	import Header from '$lib/Header/index.svelte';
	import '../app.css';
	import '../themes/fantasy.css';
</script>

<div class="theme-{$settingsStore.theme}">
	<Header />

	<main class="main">
		<slot />
	</main>
</div>

<style>
	main.main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
