import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		// Keep pdfmake external so Node resolves it natively (avoids CJS→ESM
		// breakage in Vite dev SSR). adapter-vercel's `external` in svelte.config.js
		// ensures pdfmake is deployed with the Vercel function at runtime.
		external: ['pdfmake']
	}
});
