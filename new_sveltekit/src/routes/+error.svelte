<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="error-container">
	<h1>{page.status}</h1>
	<p>{page.error?.message ?? 'Page not found.'}</p>
	<a href="/">Back home</a>
</div>

<style>
	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		min-height: 60vh;
		color: white;
		text-align: center;
	}

	h1 {
		font-size: 3rem;
		margin: 0;
	}

	a {
		color: white;
		text-decoration: underline;
	}

	a:hover {
		color: slateblue;
	}
</style>
