<script>
	import Header from './components/Header.svelte';
	import Title from './components/Title.svelte';
	import Features from './components/Features.svelte';
	async function lastVersion(){
		let request = await fetch('https://routinehub.co/api/v1/shortcuts/5015/versions/latest')
		let response = await request.json()
		return response
	}
	let promise; 
	promise = lastVersion();
</script>

<main>
	{#await promise}
		<span></span>
	{:then latest} 
		<Header downloadId={latest.id} />
		<Title />
		<Features />
	{/await}
</main>