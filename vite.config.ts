import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const prod = process.env.NODE_ENV === 'production';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		// Dev: keep pdfmake external so Vite loads it via native Node CJS require.
		// Prod: tell Rollup to bundle it — Rollup's CJS plugin handles the
		// exports/__esModule interop correctly, making the static import work.
		...(prod ? { noExternal: ['pdfmake'] } : { external: ['pdfmake'] })
	}
});
