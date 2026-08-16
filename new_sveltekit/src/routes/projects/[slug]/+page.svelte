<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.project.repo} — Yusuf Afzal</title>
</svelte:head>

<div class="project-detail">
	<a class="back-link" href="/projects/">&larr; All projects</a>
	<h1>{data.project.repo}</h1>
	{#if data.project.description}
		<p class="description">{data.project.description}</p>
	{/if}
	<div class="meta">
		{#if data.project.language}<span>{data.project.language}</span>{/if}
		<span>&#9733; {data.project.stars}</span>
		<a href="https://github.com/{data.project.fullName}" target="_blank" rel="noreferrer"
			>View on GitHub</a
		>
		{#if data.project.homepage}
			<a href={data.project.homepage} target="_blank" rel="noreferrer">Homepage</a>
		{/if}
	</div>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- readmeHtml is sanitized with isomorphic-dompurify before reaching this component -->
	<div class="readme">{@html data.readmeHtml}</div>
</div>

<style>
	.project-detail {
		background: #1f1b24;
		margin: 20px auto 2rem;
		width: min(65vw, 95vw);
		max-width: 65rem;
		color: white;
		box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
		padding: 10px 24px 24px;
		text-align: left;
	}

	.back-link {
		color: #cfcfcf;
		text-decoration: none;
		font-size: 0.9rem;
	}

	.back-link:hover {
		color: slateblue;
	}

	.description {
		color: #cfcfcf;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
	}

	.meta a {
		color: slateblue;
	}

	.readme {
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding-top: 1.5rem;
		line-height: 1.6;
		overflow-wrap: break-word;
	}

	.readme :global(img) {
		max-width: 100%;
	}

	.readme :global(pre) {
		overflow-x: auto;
		background: rgba(255, 255, 255, 0.05);
		padding: 0.75rem;
		border-radius: 4px;
	}

	.readme :global(a) {
		color: slateblue;
	}
</style>
