import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		// pdfmake uses CJS internals (js/Printer.js) that must resolve from
		// node_modules at runtime — bundling it breaks createRequire interop
		external: ['pdfmake']
	}
});
