<div>
	<button><slot name="toggle" /></button>
	<menu><slot /></menu>
</div>

<style>
	div {
		transition: all 0.5s ease;
		position: relative;
		display: inline-block;
	}

	button {
		border: none;
		background-color: inherit;
	}

	menu {
		position: absolute;
		display: none;
		margin-block-start: 0;
		padding: 0;
		border: 1px solid black;
		background-color: white;
		visibility: hidden;
		opacity: 0;
		right: 1%;
		overflow: hidden;
        left: 0;
        width: fit-content;
        z-index: 10;
	}

	div:hover > menu,
	div:focus > menu {
		display: block;
		visibility: visible;
		opacity: 1;
	}
</style>
