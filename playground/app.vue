<script setup lang="ts">
const { data: version, refresh } = await useFetch('/api/version')
</script>

<template>
	<div>
		<pre>Version: {{ version }}</pre>
		<button @click="() => refresh()">Refresh</button>
	</div>
</template>
