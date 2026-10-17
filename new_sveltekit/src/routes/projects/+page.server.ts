import { loadRepos, unmappedRepos } from '$lib/server/repos';

export async function load({ fetch }) {
	const repos = await loadRepos(fetch);
	return { loose: unmappedRepos(repos).map(({ name, description }) => ({ name, description })) };
}
