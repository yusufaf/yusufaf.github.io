import { activity } from '$lib/server/activity';
import { CATALOG_REPOS, loadRepos, unmappedRepos } from '$lib/server/repos';

export async function load({ fetch }) {
	const repos = await loadRepos(fetch);
	const loose = unmappedRepos(repos);
	if (loose.length) {
		console.warn(
			`[catalog] ${loose.length} public repo(s) not in the catalog: ${loose.map((r) => r.name).join(', ')}`
		);
	}
	return {
		activity: activity(repos, CATALOG_REPOS),
		loose: loose.map(({ name, description }) => ({ name, description }))
	};
}
