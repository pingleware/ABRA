import { readFileSync } from 'fs';
import pdf from 'pdf-extraction';

export async function PDFToText(fileLoc) {
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