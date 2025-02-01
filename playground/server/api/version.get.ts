export default defineEventHandler(async (event) => {
	const version = useAppVersion()

	return version
})
