<script context="module">
	import Chevron from 'svelte-feather-icons/src/icons/ChevronDownIcon';
</script>

<script lang="ts">
	export let title: string;
</script>

<div class="root">
	<div class="title"><span>{title}</span><Chevron /></div>
</div>

<style>
</style>
