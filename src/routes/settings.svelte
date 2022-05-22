<script>
	import SettingsManager, {
		settingsStore,
		settingsSetup,
		settingsTypes
	} from '$lib/SettingsManager';
	import { onMount } from 'svelte';
	import { STATUS } from '$lib/enums';

	let projStatus = SettingsManager.getStatus();

	onMount(() => {
		if (projStatus === STATUS.UNSTARTED) SettingsManager.buildFromFile();
	});

	settingsStore.subscribe(() => {
		projStatus = SettingsManager.getStatus();
	});

	function onUpdateInput(key, newValue) {
		SettingsManager.changeSettings(key, newValue);
	}
</script>

<div>
	<h3>Settings</h3>
	{#if projStatus === STATUS.BUILT}
		<div class="settings">
			{#each settingsSetup as set}
				<div class="setting-item">
					<label for="set-{set.key}">{set.text}</label>
					{#if set.type === settingsTypes.check}
						<input
							name="set-{set.key}"
							type="checkbox"
							checked={$settingsStore[set.key]}
							on:change={(evt) => onUpdateInput(set.key, evt.currentTarget.checked)}
						/>
					{:else if set.type === settingsTypes.dial}
						<input
							name="set-{set.key}"
							type="number"
							min={set.min}
							max={set.max}
							step="1"
							value={$settingsStore[set.key]}
							on:change={(evt) => onUpdateInput(set.key, evt.currentTarget.value)}
						/>
						<span>Set between {set.min} and {set.max}</span>
					{:else if set.type === settingsTypes.select}
						<select
							value={$settingsStore[set.key]}
							on:change={(evt) => onUpdateInput(set.key, evt.currentTarget.value)}
						>
							{#each set.choices as choice}
								<option value={choice}>{choice}</option>
							{/each}
						</select>
					{/if}
				</div>
			{/each}
		</div>
	{:else if projStatus === STATUS.UNSTARTED || projStatus === STATUS.STARTED}
		<h4>Settings Loading</h4>
	{:else}
		<p>Settings file being built from local settings</p>
		<button>Overwrite local settings</button>
	{/if}
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
