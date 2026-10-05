<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Projects — Yusuf Afzal</title>
</svelte:head>

<div class="projects-container">
	<h1>Projects</h1>
	<ul class="projects-list">
		{#each data.externalProjects as project (project.url)}
			<li class="project-card">
				<a class="project-link" href={project.url}>{project.name} ↗</a>
				<p class="project-description">{project.description}</p>
				{#if project.topics.length}
					<div class="project-topics">
						{#each project.topics as topic (topic)}
							<span class="topic">{topic}</span>
						{/each}
					</div>
				{/if}
			</li>
		{/each}
		{#each data.projects as project (project.repo)}
			<li class="project-card">
				<a class="project-link" href="/projects/{project.repo}/">{project.repo}</a>
				{#if project.description}
					<p class="project-description">{project.description}</p>
				{/if}
				{#if project.topics.length}
					<div class="project-topics">
						{#each project.topics as topic (topic)}
							<span class="topic">{topic}</span>
						{/each}
					</div>
				{/if}
			</li>
		{:else}
			<li class="project-empty">No projects synced yet — run `pnpm run sync:projects`.</li>
		{/each}
	</ul>
</div>

<style>
	.projects-container {
		background: #1f1b24;
		margin: 20px auto 2rem;
		width: min(60vw, 95vw);
		max-width: 60rem;
		color: white;
		box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
		padding: 10px 20px 20px;
		text-align: left;
	}

	.projects-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.project-card {
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding-bottom: 1rem;
	}

	.project-link {
		color: white;
		font-weight: bold;
		font-size: 1.1rem;
		text-decoration: none;
	}

	.project-link:hover {
		color: slateblue;
	}

	.project-description {
		margin: 0.35rem 0 0;
		color: #cfcfcf;
	}

	.project-topics {
		margin-top: 0.5rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.topic {
		font-size: 0.75rem;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 999px;
		padding: 0.15rem 0.6rem;
	}

	.project-empty {
		color: #cfcfcf;
	}
</style>
