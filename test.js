//import { downloadPDFs } from './modules/announcementGetter.mjs';
//import { extractPDFs } from './modules/pdfExtract.mjs';
import { downloadXLS } from './modules/financialGetter.mjs';
import { extractXLS } from './modules/xlsExtract.mjs';
import { DeltaZAltmansZScore, DeltaPustylnicksPScore, DeltaRealWealthRScore, DeltaPerceivedWealthPScore, AcidTestRatio, CurrentRatio, CashPercentage, InventoryTurnover, DaysReceivable, ROE, ROA, DebtToEquityRatio } from './modules/financialAlgorithms.mjs';

const companyCode = `BHP`;
const year = 2020;

const years = [ year-1, year ];

//await downloadPDFs(companyCode);
await downloadXLS(companyCode, years);

//const data = await extractPDFs(companyCode);
const XLSData = extractXLS(companyCode, years);
const currentYearXLS = XLSData[years[1]];
const previousYearXLS = XLSData[years[0]];

const pack = {
    meta: { companyCode, year, years },
    markers: {
        DeltaZAltmansZScore: DeltaZAltmansZScore(currentYearXLS, previousYearXLS),
        DeltaPustylnicksPScore: DeltaPustylnicksPScore(currentYearXLS, previousYearXLS),
        DeltaRealWealthRScore: DeltaRealWealthRScore(currentYearXLS, previousYearXLS),
        DeltaPerceivedWealthPScore: DeltaPerceivedWealthPScore(currentYearXLS, previousYearXLS),
        AcidTestRatio: AcidTestRatio(currentYearXLS),
        CurrentRatio: CurrentRatio(currentYearXLS),
        CashPercentage: CashPercentage(currentYearXLS),
        InventoryTurnover: InventoryTurnover(currentYearXLS),
        DaysReceivable: DaysReceivable(currentYearXLS),
        ROE: ROE(currentYearXLS),
        ROA: ROA(currentYearXLS),
        DebtToEquityRatio: DebtToEquityRatio(currentYearXLS)
    }
}

console.log(pack);

console.log(`Through Altmans and Pustylnicks scores, 𝝙P ${pack.markers.DeltaPustylnicksPScore} > 𝝙Z ${pack.markers.DeltaZAltmansZScore} = ${pack.markers.DeltaPustylnicksPScore>pack.markers.DeltaZAltmansZScore} suggests that ${companyCode} may be involved in manipulating their financial statements.`);
console.log(`Through Pustylnicks Real and Perceived wealth scores, if 𝝙P - 𝝙R = ${pack.markers.DeltaPerceivedWealthPScore - pack.markers.DeltaRealWealthRScore} > 0.3 = ${pack.markers.DeltaPerceivedWealthPScore - pack.markers.DeltaRealWealthRScore > 0.3} suggests ${companyCode} were more likely to be involved in financial statement manipulation`);
