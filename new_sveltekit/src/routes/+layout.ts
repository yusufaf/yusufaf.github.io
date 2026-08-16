export const prerender = true;
// GH Pages resolves `/foo/` -> `foo/index.html` but not reliably `/foo`
// (no slash) -> the same file. Since the site is prerendered directory-style,
// every internal link needs a trailing slash — setting this tree-wide removes
// the whole bug class instead of remembering it per link.
//
// Note: `trailingSlash` is a route-config option (exported from
// +layout.js/+page.js), not a `kit` field in svelte.config.js — the rebuild
// plan's svelte.config.js snippet placed it under `kit`, which SvelteKit
// rejects with "Unexpected option config.kit.trailingSlash". Moved here to
// match the actual API while keeping the same site-wide effect.
export const trailingSlash = 'always';
