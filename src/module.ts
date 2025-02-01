import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { addServerImports, addTemplate, createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'
import semver from 'semver'
import simpleGit from 'simple-git'

const log = useLogger('nuxt-app-version')

export default defineNuxtModule({
	meta: {
		name: 'nuxt-app-version',
		compatibility: {
			nuxt: '^3.0.0',
		},
	},
	async setup(_options, nuxt) {
		const resolver = createResolver(import.meta.url)

		addServerImports([
			{
				name: 'useAppVersion',
				from: resolver.resolve(`${nuxt.options.buildDir}/app-version.ts`),
			},
		])

		await updateVersionTemplate()

		nuxt.hook('builder:watch', async () => {
			await updateVersionTemplate()
		})
	},
})

async function updateVersionTemplate() {
	const version = await getVersion()
	const appVersionTemplate = addTemplate({
		filename: 'app-version.ts',
		write: true,
		getContents: () => `export function useAppVersion() { return "${version}" }`,
	})

	log.info('Updated app version:', version)
}

async function getVersion() {
	const packageVersion = await getPackageVersion()
	const gitTag = await getCurrentTag()
	const gitHead = await getGitHead()
	const gitIsDirty = await getGitIsDirty()

	// Base version - try package.json version first, then git tag, then 0.0.0
	const baseVersion = packageVersion || gitTag || '0.0.0'

	// Build metadata parts
	const buildParts = []
	if (gitHead) buildParts.push(gitHead)
	if (gitIsDirty) {
		buildParts.push('dirty')

		// Add datetime in YYYYMMDD-HHMMSS format when dirty
		const now = new Date()
		const datetime = now.toISOString()
			.replace(/[-:]/g, '')
			.replace(/[T.]/g, '-')
			.slice(0, 15) // Gets YYYYMMDD-HHMMSS part
		buildParts.push(datetime)
	}

	// Combine version with build metadata
	const version = buildParts.length > 0
		? `${baseVersion}+${buildParts.join('.')}`
		: baseVersion

	// Validate the version string
	const validVersion = semver.valid(version)
	if (!validVersion) {
		console.error('Generated invalid semver version:', version)
		return baseVersion
	}

	return version
}

async function getPackageVersion() {
	try {
		const packageJsonPath = resolve(process.cwd(), 'package.json')
		const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
		return packageJson.version as string
	}
	catch (err) {
		console.error('Error reading package.json version:', err)
		return
	}
}

async function getCurrentTag() {
	const git = simpleGit()

	try {
		const { all: tags } = await git.tags()
		const validTags = tags
			.filter((tag) => semver.valid(tag))
			.sort((a, b) => semver.rcompare(a, b))
		if (validTags.length > 0) {
			return validTags[0]
		}

		return
	}
	catch (err) {
		console.error('Error getting current tag:', err)
		return
	}
}

async function getGitHead() {
	const git = simpleGit()

	try {
		const gitHead = await git.revparse(['HEAD'])
		const shortGitHead = gitHead.slice(0, 7)
		return shortGitHead
	}
	catch (err) {
		console.error('Error getting git head:', err)
		return
	}
}

async function getGitIsDirty() {
	const git = simpleGit()

	try {
		const isDirty = await git.status()
		return isDirty
	}
	catch (err) {
		console.error('Error getting git is dirty:', err)
		return
	}
}
