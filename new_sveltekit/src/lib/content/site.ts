// Approved copy for the intro block and links. See scripts/lint-copy.mjs.

export const NAME = 'Yusuf Afzal';
export const TITLE = 'Software Engineer';

export const INTRO =
	'I build fixes for my own problems, and open source alternatives to apps I use. Mostly TypeScript, JavaScript, AWS.';

export const MOD_LINE =
	"Making your software feel like yours is half the fun of the internet. Everything here I modded, or built because the stock version didn't do it.";

export const CREDIT =
	'Paper texture sampled from Anna Atkins, Photographs of British Algae, c. 1853. The Met, public domain.';
export const CREDIT_HREF = 'https://www.metmuseum.org/art/collection/search/291572';

export const SITE_URL = 'https://yusufaf.dev';

/** Set once static/resume.pdf exists; until then the Resume link stays hidden. */
export const RESUME_PDF: string | null = null;

export const LINKS: { label: string; href: string }[] = [
	{ label: 'hi@yusufaf.dev', href: 'mailto:hi@yusufaf.dev' },
	{ label: 'GitHub', href: 'https://github.com/yusufaf' },
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/yusuf-afzal/' },
	{ label: 'Spotify', href: 'https://open.spotify.com/user/hiqc8fyu2bw1x05kdqzevo5l7' }
];
