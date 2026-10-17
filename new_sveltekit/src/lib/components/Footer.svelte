<script lang="ts">
	import { CREDIT, CREDIT_HREF } from '$lib/content/site';

	let { activity = null }: { activity?: { repo: string; day: string } | null } = $props();
</script>

<footer>
	{#if activity}
		<p>
			Lately: <a href="https://github.com/yusufaf/{activity.repo}">{activity.repo}</a>, {activity.day}
		</p>
	{/if}
	<p class="credit"><a href={CREDIT_HREF}>{CREDIT}</a></p>
</footer>

<style>
	footer {
		max-width: var(--measure);
		margin: 0 auto;
		box-sizing: border-box;
		padding: 40px var(--gutter) 64px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 12px 40px;
		font-size: 14px;
		color: var(--mist);
	}

	p {
		margin: 0;
	}

	a {
		color: var(--mist);
	}

	.credit {
		max-width: 560px;
	}

	.credit a {
		text-decoration: none;
	}

	.credit a:hover {
		text-decoration: underline;
	}
</style>
