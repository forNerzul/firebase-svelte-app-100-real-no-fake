<script lang="ts">
	import { page } from '$app/stores';
	import AnimatedRoutes from '$lib/components/AnimatedRoutes.svelte';
</script>

<nav class="flex justify-center my-6">
	<ul class="steps">
		<a href="/login" class="step step-primary">Sign In</a>
		<a
			href="/login/username"
			class="step"
			class:step-primary={$page.route.id?.match(/username|photo/g)}
		>
			Choose Username
		</a>
		<a href="/login/photo" class="step" class:step-primary={$page.route.id?.includes('photo')}>
			Upload Photo
		</a>
	</ul>
</nav>

<AnimatedRoutes>
	<main class="w-4/6 mx-auto card bg-neutral text-neutral-content">
		<div class="items-center text-center card-body">
			<slot />
		</div>
	</main>
</AnimatedRoutes>
