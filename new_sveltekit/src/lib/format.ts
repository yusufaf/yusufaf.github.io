// Day precision only, in Pacific time: a timestamp would publish working hours.
const DAY = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	timeZone: 'America/Los_Angeles'
});
const DAY_YEAR = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	year: 'numeric',
	timeZone: 'America/Los_Angeles'
});

export function formatDay(iso: string, withYear = false): string {
	return (withYear ? DAY_YEAR : DAY).format(new Date(iso));
}
