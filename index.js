import { downloadPDFs } from './modules/announcementGetter.mjs';
import { extractPDFs } from './modules/pdfExtract.mjs';

const companyCode = `vrs`;

await downloadPDFs(companyCode);
const data = await extractPDFs(companyCode);

console.log(data.length);