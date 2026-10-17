// Curated catalog. Every string here is approved copy (see the copy guard in
// scripts/lint-copy.mjs); repo facts (language, last push) come from
// content/projects/_repos.json at build time.

export type ObjectId = 'watch' | 'record' | 'controller' | 'basketball' | 'cards' | 'stencil';

export type Entry = {
	/** Name shown in the catalog. */
	label: string;
	/** Project page heading; defaults to label. */
	title?: string;
	blurb: string;
	/** GitHub repo under yusufaf; entries with a repo get a /projects/<repo>/ page. */
	repo?: string;
	/** Where the thing runs. `external` marks paths this SvelteKit app doesn't own. */
	live?: { href: string; external?: boolean };
	/** Link for entries without a page of their own. */
	href?: string;
};

export type Group = {
	id: ObjectId | 'offprint';
	name: string;
	/** Name on the print and in the legend, when it differs from the catalog heading. */
	printName?: string;
	/** Caption for objects on the print; also the hover text on the hero. */
	caption?: string;
	entries: Entry[];
};

export const GROUPS: Group[] = [
	{
		id: 'record',
		name: 'Record',
		caption: "Spotify mods. Album length is the one I can't live without.",
		entries: [
			{
				label: 'spicetify.yusufaf.dev',
				title: 'spicetify-site',
				blurb: 'Docs for all six Spotify mods.',
				repo: 'spicetify-site',
				live: { href: 'https://spicetify.yusufaf.dev/' }
			},
			{
				label: 'album-length',
				blurb: "Every track's album length, inline.",
				repo: 'spicetify-album-length'
			},
			{ label: 'enhanced-pins', blurb: 'More than four pins.', repo: 'spicetify-enhanced-pins' },
			{ label: 'rym', blurb: 'One click from album to RateYourMusic.', repo: 'spicetify-rym' },
			{
				label: 'listening-list',
				blurb: 'My "Albums to Listen" playlist, built in.',
				repo: 'spicetify-listening-list'
			},
			{
				label: 'enhanced-folders',
				blurb: 'Images and descriptions for playlist folders.',
				repo: 'spicetify-enhanced-folders'
			},
			{
				label: 'local-files-plus',
				blurb: 'Real tag columns for local files.',
				repo: 'spicetify-local-files-plus'
			},
			{ label: 'audio-tag-mcp', blurb: 'Mp3tag, from a chat.', repo: 'audio-tag-mcp' }
		]
	},
	{
		id: 'watch',
		name: 'Watch',
		caption: "Wren, Thunderbird for a watch. Lark, an alarm that doesn't need the phone.",
		entries: [
			{ label: 'Wren', title: 'wren-mail', blurb: 'Thunderbird for a watch.', repo: 'wren-mail' },
			{
				label: 'Lark',
				title: 'lark-alarm',
				blurb: "An alarm that doesn't need the phone.",
				repo: 'lark-alarm'
			}
		]
	},
	{
		id: 'controller',
		name: 'Controller',
		caption: 'Catppuccin for Steam, then the Xbox app.',
		entries: [
			{
				label: 'catppuccin-millennium',
				blurb: 'Catppuccin for Steam.',
				repo: 'catppuccin-millennium'
			},
			{
				label: 'mjolnir',
				blurb: 'Then the Xbox app. Theme editor live at /mjolnir.',
				repo: 'mjolnir',
				live: { href: '/mjolnir/', external: true }
			},
			{
				label: 'tf2-loadout-assistant',
				blurb:
					'Loadout help from my most-played game, r/tf2fashionadvice style. Live at tf2.yusufaf.dev.',
				repo: 'tf2-loadout-assistant',
				live: { href: 'https://tf2.yusufaf.dev/' }
			},
			{ label: 'tf2-wiki-mcp', blurb: 'The TF2 wiki, for LLMs.', repo: 'tf2-wiki-mcp' }
		]
	},
	{
		id: 'basketball',
		name: 'Basketball',
		printName: 'Basketball net',
		caption: 'Blazers fan for life. All-time five: Dame, B-⁠Roy, LeBron, KD, Jokić.',
		entries: [
			{
				label: 'nba.yusufaf.dev',
				title: 'nba-central',
				blurb: 'The all-time team builder.',
				repo: 'nba-central',
				live: { href: 'https://nba.yusufaf.dev/' }
			},
			{
				label: 'Blazers court',
				title: 'basketball_court_threejs',
				blurb: "My team's court in Three.js. A school project.",
				repo: 'basketball_court_threejs',
				live: { href: '/demos/basketball-court/', external: true }
			}
		]
	},
	{
		id: 'cards',
		name: 'Index cards',
		caption: "Quizaroni. Quizlet wouldn't let me customize anything.",
		entries: [
			{
				label: 'quizaroni.yusufaf.dev',
				title: 'quizaroni',
				blurb: "Quizlet wouldn't let me customize anything.",
				repo: 'quizaroni',
				live: { href: 'https://quizaroni.yusufaf.dev/' }
			}
		]
	},
	{
		id: 'stencil',
		name: 'Stencil',
		caption: 'Step Functions diagrams without a screenshot.',
		entries: [
			{
				label: 'sfn.yusufaf.dev',
				title: 'sfn-diagram',
				blurb: 'Step Functions diagrams without a screenshot.',
				repo: 'sfn-diagram',
				live: { href: 'https://sfn.yusufaf.dev/' }
			},
			{
				label: 'sfn-diagram-action',
				blurb: 'The same diagrams, diffed on pull requests.',
				repo: 'sfn-diagram-action'
			}
		]
	},
	{
		id: 'offprint',
		name: 'Not on the print',
		entries: [
			{
				label: 'aula-volume-knob',
				blurb: 'A smarter volume knob, no macros needed.',
				repo: 'aula-volume-knob'
			},
			{
				label: 'vencord-taskbar-status',
				blurb: 'Discord status from the taskbar, no extra clicks.',
				repo: 'vencord-taskbar-status'
			},
			{
				label: 'no-incognito',
				blurb: 'Turns off private browsing in Firefox and Zen.',
				repo: 'no-incognito'
			},
			{
				label: 'duck-viewer',
				blurb: 'DuckDuckGo results on a phone with no browser.',
				repo: 'duck-viewer'
			},
			{
				label: 'Self-hosted on Fly',
				blurb:
					'Self-hosted open source apps, cheaper than AWS. wallabag, Suwayomi, Open Notebook and five more.',
				href: 'https://github.com/yusufaf?tab=repositories&q=flyio'
			}
		]
	}
];

/** Public repos deliberately left out of the catalog (covered elsewhere or not portfolio work). */
export const UNLISTED_REPOS = new Set([
	'yusufaf',
	'yusufaf.github.io',
	'homebrew-tap',
	'spicetify-agent-skills',
	'logto-flyio',
	'ntfy-flyio',
	'open-notebook-flyio',
	'sparkyfitness-flyio',
	'suwayomi-flyio',
	'umami-flyio',
	'wallabag-flyio',
	'yamtrack-flyio'
]);

/** Hero objects in reading order. */
export const PRINT_OBJECTS = GROUPS.filter(
	(g): g is Group & { id: ObjectId } => g.id !== 'offprint'
);

export const ORDERED_OBJECTS: ObjectId[] = [
	'watch',
	'record',
	'controller',
	'basketball',
	'cards',
	'stencil'
];
