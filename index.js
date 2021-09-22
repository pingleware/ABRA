import { readdirSync } from 'fs';
import { PDFToText } from './modules/pdfExtract.mjs';

const examplesDocsLoc = `./example_docs/`;

let docLocations = [];

readdirSync(examplesDocsLoc).forEach(fileLoc => {
    docLocations.push(examplesDocsLoc + fileLoc);
});

console.log(await PDFToText(docLocations[0]));