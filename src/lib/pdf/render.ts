import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { Student, FlagSet } from '$lib/types';
// @ts-expect-error — pdfmake subpath has no TS declarations; typed via PdfPrinterCtor below
import _PdfPrinter from 'pdfmake/js/Printer.js';
import { buildDocDef, WORKSHEET_FONTS } from '$lib/pdf/docdef';

export type { WorksheetData, WorksheetSection, WorksheetQuestion } from '$lib/pdf/docdef';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PdfPrinterCtor = new (fonts: object, vfs?: unknown, urlResolver?: unknown, localAccess?: unknown) => { createPdfKitDocument(def: TDocumentDefinitions): Promise<any> };

// Dev (ssr.external): Vite hands us module.exports = { __esModule:true, default: Class }
// Prod (ssr.noExternal): Rollup's CJS plugin unwraps to the class directly
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Printer = (typeof _PdfPrinter === 'function' ? _PdfPrinter : (_PdfPrinter as any).default) as unknown as PdfPrinterCtor;

export async function renderWorksheet(
	data: Parameters<typeof buildDocDef>[0],
	student: Student,
	flags: FlagSet | null
): Promise<Buffer> {
	const docDef = buildDocDef(data, student, flags);
	const printer = new Printer(WORKSHEET_FONTS, undefined, { resolve: () => {}, resolved: async () => {} }, undefined);
	const doc = await printer.createPdfKitDocument(docDef);

	return new Promise<Buffer>((resolve, reject) => {
		const chunks: Buffer[] = [];
		doc.on('data', (chunk: Buffer) => chunks.push(chunk));
		doc.on('end', () => resolve(Buffer.concat(chunks)));
		doc.on('error', reject);
		doc.end();
	});
}
