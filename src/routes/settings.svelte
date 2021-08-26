<script>
	import { types, settings, settingsStatus } from '$lib/settings';

	let settingsStatuslocal;
	settingsStatus.subscribe((value) => {
		settingsStatuslocal = value;
	});
	function onUpdateInput(key, newValue) {
		const newObj = Object.assign(settingsStatuslocal, {});
		newObj[key] = newValue;
		settingsStatus.update(() => newObj);
	}
</script>

<div>
	<h3>Settings</h3>
	<div class="settings">
		{#each Object.keys(settings) as key}
			<div class="setting-item">
				<label>{settings[key].text}</label>
				{#if settings[key].type === types.bool}
					<input
						type="checkbox"
						bind:checked={settingsStatuslocal[key]}
						on:change={(evt) => onUpdateInput(key, evt.currentTarget.checked)}
					/>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.settings {
		padding-left: 2rem;
		margin-left: 2rem;
		border-left: 1px solid grey;
	}
	.setting-item {
		padding: 5px 0;
		display: flex;
		align-items: center;
	}
	.setting-item label {
		min-width: 60vw;
		display: inline-block;
		font-size: 18px;
	}
	.setting-item input {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0.25em;
		border: 0.1em solid currentColor;
		background: transparent;
	}
</style>
