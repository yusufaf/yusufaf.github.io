import { unmappedRepos } from '$lib/server/repos';

export function load() {
	return { loose: unmappedRepos().map(({ name, description }) => ({ name, description })) };
}
