import { SITE_URL } from '$lib/content/site';
import { CATALOG_REPOS } from '$lib/server/repos';

export const prerender = true;

export function GET() {
	const paths = ['/', '/projects/', ...[...CATALOG_REPOS].map((r) => `/projects/${r}/`)];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`).join('\n')}
</urlset>
`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
