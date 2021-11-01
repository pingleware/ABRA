//import { downloadPDFs } from './modules/announcementGetter.mjs';
//import { extractPDFs } from './modules/pdfExtract.mjs';
import { downloadXLS } from './modules/financialGetter.mjs';
import { extractXLS } from './modules/xlsExtract.mjs';
import { createMarkersObject } from './modules/financialAlgorithms.mjs';

const companyCode = `TTC`;
const year = 2017;

const years = [ year-1, year ];

//await downloadPDFs(companyCode);
await downloadXLS(companyCode, years);

//const data = await extractPDFs(companyCode);
const XLSData = extractXLS(companyCode, years);
const currentYearXLS = XLSData[years[1]];
const previousYearXLS = XLSData[years[0]];

const pack = {
    meta: { companyCode, year, years },
    markers: createMarkersObject(currentYearXLS, previousYearXLS)
}

console.log(pack);

/*
PAS: 2003, 2004
RIO: 2005, 2006
MOZ: 2008, 2014, 2015
*/