import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			runtime: 'nodejs20.x',
			// pdfmake is CJS-only and must be resolved via createRequire at runtime.
			// Marking it external instructs adapter-vercel to deploy it alongside
			// the function so node_modules resolution finds it on Vercel.
			external: ['pdfmake']
		})
	}
};

export default config;
