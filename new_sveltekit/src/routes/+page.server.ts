import { loadActivity } from '$lib/server/activity';
import { CATALOG_REPOS, REPOS, unmappedRepos } from '$lib/server/repos';

export async function load({ fetch }) {
	const loose = unmappedRepos();
	if (loose.length) {
		console.warn(
			`[catalog] ${loose.length} public repo(s) not in the catalog: ${loose.map((r) => r.name).join(', ')}`
		);
	}
	return {
		activity: await loadActivity(REPOS, CATALOG_REPOS, fetch),
		loose: loose.map(({ name, description }) => ({ name, description }))
	};
}
