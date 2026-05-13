import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	console.log('[api/profile] Student profile received:', JSON.stringify(body, null, 2));
	return json({ ok: true });
};
