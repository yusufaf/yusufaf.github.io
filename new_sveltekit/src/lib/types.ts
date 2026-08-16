export type ProjectEntry = {
	repo: string;
	fullName: string;
	description: string;
	homepage: string;
	topics: string[];
	language: string;
	stars: number;
	pushedAt: string;
	defaultBranch: string;
	readmeMarkdown: string;
	readmeSha: string;
	fetchedAt: string;
};

export type ProjectIndex = {
	slugs: string[];
	lastSyncAttempt: string;
	lastFullSyncSuccess: boolean;
	failedSlugs: string[];
};
