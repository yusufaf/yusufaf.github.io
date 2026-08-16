<svelte:head>
	<title>Demos — Yusuf Afzal</title>
</svelte:head>

<div class="demos-container">
	<h1>Demos</h1>
	<ul class="demos-list">
		<li>
			<a class="demo-link" href="/demos/basketball-court/" rel="external"
				>Basketball Court (Three.js)</a
			>
			<p>A 3D basketball court scene built with Three.js.</p>
		</li>
	</ul>
</div>

<style>
	.demos-container {
		background: #1f1b24;
		margin: 20px auto 2rem;
		width: min(45vw, 90vw);
		max-width: 45rem;
		color: white;
		box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
		padding: 10px 20px 20px;
		text-align: left;
	}

	.demos-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.demo-link {
		color: white;
		font-weight: bold;
		text-decoration: none;
	}

	.demo-link:hover {
		color: slateblue;
	}

	.demos-list p {
		color: #cfcfcf;
		margin: 0.25rem 0 0;
	}
</style>
