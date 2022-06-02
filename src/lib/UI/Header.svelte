<script>
	import { page } from '$app/stores';
	import { ProjectDataStore } from '$lib/ProjectBuilder';
</script>

<header>
	<nav class="navigation">
		<ul>
			<li class:active={$page.url.pathname === '/'}><a sveltekit:prefetch href="/">Home</a></li>
			<li class:active={$page.url.pathname === '/table'}>
				<a sveltekit:prefetch href="/table">Tables</a>
			</li>
			<li class:active={$page.url.pathname === '/settings'}>
				<a sveltekit:prefetch href="/settings">Settings</a>
			</li>
			<li class:active={$page.url.pathname === '/projects'}>
				<a sveltekit:prefetch href="/projects">Projects</a>
			</li>
			{#if $ProjectDataStore}
				<li class:active={$page.url.pathname === '/project'}>
					<a sveltekit:prefetch href="/project">Project - {$ProjectDataStore.name}</a>
				</li>
			{/if}
		</ul>
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		color: var(--heading-color);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 10%;
		text-decoration: none;
		transition: color 0.2s linear;
		padding: 0.6em;
		font-size: 0.65rem;
	}
	@media (min-width: 720px) {
		nav a {
			padding: 0 1em;
			font-size: 0.8rem;
		}
	}

	a:hover {
		color: var(--accent-color);
	}
</style>
