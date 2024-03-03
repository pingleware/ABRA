import { getListed } from './modules/getListed.mjs';
import { trainModel, createResult } from './modules/nn.mjs';
import { initSheet, saveCellToSheet } from './modules/googleSheets.mjs';

const [, listed ] = await Promise.all([trainModel(), getListed()]);

const year = new Date().getFullYear() - 1;

await initSheet(listed.length);

for (let i = 0; i < listed.length; i++) {
    let confidence = `Incomplete Dataset`;

    try {
        confidence = await createResult(listed[i], year) || `Incomplete Dataset`;
        console.log(`${listed[i]}: ${confidence}`);
    } catch(err) {
        console.log(`${listed[i]}: ${confidence}`);
    }

    if (typeof confidence === `number`) {
        await saveCellToSheet(listed[i], confidence);
    }
}
