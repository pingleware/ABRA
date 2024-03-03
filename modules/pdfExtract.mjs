import { getAllFilePaths } from './databaseManager.mjs';
import { readFileSync } from 'fs';
import pdf from 'pdf-extraction';

async function PDFFileToText(fileLoc) {
    const dataBuffer = readFileSync(fileLoc);

    return await pdf(dataBuffer).then(data => {
        // number of pages
        //console.log(data.numpages);
        // number of rendered pages
        //console.log(data.numrender);
        // PDF info
        //console.log(data.info);
        // PDF metadata
        //console.log(data.metadata);
        // PDF.js version
        // check https://mozilla.github.io/pdf.js/getting_started/
        //console.log(data.version);
        // PDF text
        return data.text;
    });
}

export async function extractPDFs(companyCode) {
    const filePaths = getAllFilePaths(companyCode);
    
    const filteredFilePaths = filePaths.filter(path => path.endsWith('.pdf'));

    const fileTextPromises = [];

    filteredFilePaths.forEach(filePath => {
        fileTextPromises.push(PDFFileToText(filePath));
    });

    const fileTexts = Promise.all(fileTextPromises);

    return fileTexts;
}