import { downloadPDFs } from './modules/announcementGetter.mjs';
import { extractPDFs } from './modules/pdfExtract.mjs';
import { downloadXLS } from './modules/financialGetter.mjs';
import { extractXLS } from './modules/xlsExtract.mjs';
import { DeltaZAltmansZScore, DeltaPustylnicksPScore, DeltaRealWealthRScore, DeltaPerceivedWealthPScore, AcidTestRatio, CurrentRatio } from './modules/financialAlgorithms.mjs';

const companyCode = `BHP`;
const year = 2020;

const years = [ year-1, year ];

//await downloadPDFs(companyCode);
await downloadXLS(companyCode, years);

//const data = await extractPDFs(companyCode);
const XLSData = extractXLS(companyCode, years);
const currentYearXLS = XLSData[years[1]];
const previousYearXLS = XLSData[years[0]];

const DeltaZAltmansZScoreRes = DeltaZAltmansZScore(currentYearXLS, previousYearXLS);
const DeltaPustylnicksPScoreRes = DeltaPustylnicksPScore(currentYearXLS, previousYearXLS);

const DeltaRealWealthRScoreRes = DeltaRealWealthRScore(currentYearXLS, previousYearXLS);
const DeltaPerceivedWealthPScoreRes = DeltaPerceivedWealthPScore(currentYearXLS, previousYearXLS);

const AcidTestRatioRes = AcidTestRatio(currentYearXLS);
const CurrentRatioRes = CurrentRatio(currentYearXLS);

console.log(`Through Altmans and Pustylnicks scores, 𝝙P ${DeltaPustylnicksPScoreRes} > 𝝙Z ${DeltaZAltmansZScoreRes} = ${DeltaPustylnicksPScoreRes>DeltaZAltmansZScoreRes} suggests that ${companyCode} may be involved in manipulating their financial statements.`);
console.log(`Through Pustylnicks Real and Perceived wealth scores, if 𝝙P - 𝝙R = ${DeltaPerceivedWealthPScoreRes - DeltaRealWealthRScoreRes} > 0.3 = ${DeltaPerceivedWealthPScoreRes - DeltaRealWealthRScoreRes > 0.3} suggests ${companyCode} were more likely to be involved in financial statement manipulation`);

console.log({ companyCode, year });
console.log(`DeltaZAltmansZScore: ${DeltaZAltmansZScoreRes}`);
console.log(`DeltaPustylnicksPScore: ${DeltaPustylnicksPScoreRes}`);
console.log(`DeltaRealWealthRScore: ${DeltaRealWealthRScoreRes}`);
console.log(`DeltaPerceivedWealthPScore: ${DeltaPerceivedWealthPScoreRes}`);
console.log(`AcidTestRatio: ${AcidTestRatioRes}`);
console.log(`CurrentRatio: ${CurrentRatioRes}`);