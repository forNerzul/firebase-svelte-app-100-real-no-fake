<script lang="ts">
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import { db, user } from '$lib/firebase';
	import { doc, getDoc, writeBatch } from 'firebase/firestore';

	let username = '';
	let loading = false;
	let isAvailable = false;

	let debounceTimer: NodeJS.Timeout;

	async function checkAvailability() {
		isAvailable = false;
		clearTimeout(debounceTimer);

		loading = true;

		debounceTimer = setTimeout(async () => {
			console.log('checking availability of ', username);

			const ref = doc(db, 'usernames', username);
			const exist = await getDoc(ref).then((doc) => doc.exists());

			isAvailable = !exist;
			loading = false;
		}, 500);
	}

	async function confirmUsername() {
		console.log('confirming username', username);

		const batch = writeBatch(db);
		batch.set(doc(db, 'usernames', username), { uid: $user?.uid });
		batch.set(doc(db, 'users', $user!.uid), {
			username,
			photoURL: $user?.photoURL ?? null,
			published: true,
			bio: "I'm the Walrus",
			links: [
				{
					title: 'Test Link',
					url: 'https://kung.foo',
					icon: 'custom'
				}
			]
		});

		await batch.commit();

		username = '';
		isAvailable = false;
	}

	const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

	$: isValid = username?.length > 2 && username.length < 16 && re.test(username);
	$: isTouched = username.length > 0;
	$: isTaken = isValid && !isAvailable && !loading;
</script>

<AuthCheck>
	<h2>Username</h2>
	<form class="w-2/5" on:submit|preventDefault={confirmUsername}>
		<input
			type="text"
			placeholder="Username"
			class="w-full input"
			bind:value={username}
			on:input={checkAvailability}
			class:input-error={!isValid && isTouched}
			class:input-warning={isTaken}
			class:input-success={isAvailable && isValid && !loading}
		/>

		<div class="w-full px-8 my-4 min-h-16">
			{#if loading && isTouched}
				<p class="text-secondary">Checking availability of @{username}...</p>
			{/if}

			{#if !isValid && isTouched}
				<p class="text-sm text-error">must be 3-16 characters long, alphanumeric only</p>
			{/if}

			{#if isValid && !isAvailable && !loading}
				<p class="text-sm text-warning">
					@{username} is not available
				</p>
			{/if}

			{#if isAvailable && isValid && !loading}
				<button class="btn btn-success">Confirm username @{username}</button>
			{/if}
		</div>
	</form>
</AuthCheck>
