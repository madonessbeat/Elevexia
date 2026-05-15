import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		// Force pdfmake into the SSR bundle so it's available in the Vercel
		// function zip — createRequire resolves it from the bundled output
		noExternal: ['pdfmake']
	}
});
