#!/usr/bin/env node
// Copy guard: fails when site copy uses phrasing that reads as AI-written or
// templated. Checks string literals in src/lib/content/ and visible text in
// .svelte markup (script and style blocks and {expressions} are ignored).
// Repo descriptions synced from GitHub are not checked; they aren't site copy.

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const BANNED = [
	/\bdelv(e|es|ing)\b/i,
	/\bcraft(ing|ed)\b/i,
	/\bpassionate\b/i,
	/\bseamless(ly)?\b/i,
	/\bleverag(e|es|ing)\b/i,
	/\brobust\b/i,
	/\bjourney\b/i,
	/\bdigital experiences?\b/i,
	/\bat the intersection of\b/i,
	/\belevat(e|es|ing)\b/i,
	/\bempower(s|ing)?\b/i,
	/\bunlock(s|ing)?\b/i,
	/\btransform(s|ing|ative)?\b/i,
	/\bshowcas(e|es|ing)\b/i,
	/\btestament\b/i,
	/\bpivotal\b/i,
	/\bvibrant\b/i,
	/\bmeticulous(ly)?\b/i,
	/\bmultifaceted\b/i,
	/\bnot just\b.*\bbut\b/i,
	/—/, // em dash
	/!/ // exclamation marks
];

async function walk(dir, ext) {
	const out = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...(await walk(full, ext)));
		else if (entry.name.endsWith(ext)) out.push(full);
	}
	return out;
}

function stringLiterals(source) {
	const out = [];
	const re = /(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g;
	for (const line of source.split('\n')) {
		if (/^\s*(\/\/|\*|\/\*)/.test(line) || /^\s*import\b/.test(line)) continue;
		for (const m of line.matchAll(re)) out.push(m[2]);
	}
	return out;
}

function markupText(source) {
	return source
		.replace(/<script[\s\S]*?<\/script>/g, '')
		.replace(/<style[\s\S]*?<\/style>/g, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/\{[^}]*\}/g, ' ')
		.replace(/<[^>]+>/g, '\n')
		.split('\n')
		.map((s) => s.trim())
		.filter(Boolean);
}

const problems = [];
for (const file of await walk(path.join(ROOT, 'src', 'lib', 'content'), '.ts')) {
	for (const text of stringLiterals(await readFile(file, 'utf-8'))) {
		for (const rule of BANNED) if (rule.test(text)) problems.push([file, rule, text]);
	}
}
for (const file of await walk(path.join(ROOT, 'src'), '.svelte')) {
	for (const text of markupText(await readFile(file, 'utf-8'))) {
		for (const rule of BANNED) if (rule.test(text)) problems.push([file, rule, text]);
	}
}

for (const [file, rule, text] of problems) {
	console.error(`${path.relative(ROOT, file)}: ${rule} in "${text}"`);
}
if (problems.length) {
	console.error(`[lint-copy] ${problems.length} problem(s).`);
	process.exit(1);
}
console.log('[lint-copy] ok');
