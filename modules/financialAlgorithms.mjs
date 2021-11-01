export function createMarkersObject(currentYearXLS, previousYearXLS) {
    return {
        DeltaZAltmansZScore: DeltaZAltmansZScore(currentYearXLS, previousYearXLS),
        DeltaPustylnicksPScore: DeltaPustylnicksPScore(currentYearXLS, previousYearXLS),
        DeltaRealWealthRScore: DeltaRealWealthRScore(currentYearXLS, previousYearXLS),
        DeltaPerceivedWealthPScore: DeltaPerceivedWealthPScore(currentYearXLS, previousYearXLS),
        AcidTestRatio: AcidTestRatio(currentYearXLS),
        CurrentRatio: CurrentRatio(currentYearXLS),
        CashPercentage: CashPercentage(currentYearXLS),
        DaysReceivable: DaysReceivable(currentYearXLS),
        ROE: ROE(currentYearXLS),
        ROA: ROA(currentYearXLS),
        DebtToEquityRatio: DebtToEquityRatio(currentYearXLS)
    }
}

function valueCrawler(array, string) {
    const result = array.find(obj => {
        if (obj.C === string) return true;
    });
    return result.D;
}

function AltmansZScore(xls) {
    const OperatingWkgCapital = valueCrawler(xls["Sundry Analysis"], "Operating Wkg Capital");
    const TotalAssets = valueCrawler(xls["Balance Sheet"], "Total Assets");
    const RetainedEarnings = valueCrawler(xls["Balance Sheet"], "Retained Earnings");
    const EBIT = valueCrawler(xls["Profit Loss"], "EBIT");
    const MarketCap = valueCrawler(xls["Ratio Analysis"], "Market Cap.");
    const TotalLiabilities = valueCrawler(xls["Balance Sheet"], "Total Liabilities");
    const OperatingRevenue = valueCrawler(xls["Profit Loss"], "Operating Revenue");

    const result = 1.2 * (OperatingWkgCapital / TotalAssets) + 1.4 * (RetainedEarnings / TotalAssets) + 3.3 * (EBIT / TotalAssets) + 0.6 * (MarketCap / TotalLiabilities) + 1 * (OperatingRevenue / TotalAssets);
    return result;
}

function DeltaZAltmansZScore(currentXLS, priviousXLS) {
    const result = (AltmansZScore(currentXLS) - AltmansZScore(priviousXLS)) / AltmansZScore(priviousXLS);
    return result;
}

function PustylnicksPScore(xls) {
    const TotalAssets = valueCrawler(xls["Balance Sheet"], "Total Assets");
    const RetainedEarnings = valueCrawler(xls["Balance Sheet"], "Retained Earnings");
    const EBIT = valueCrawler(xls["Profit Loss"], "EBIT");
    const MarketCap = valueCrawler(xls["Ratio Analysis"], "Market Cap.");
    const TotalLiabilities = valueCrawler(xls["Balance Sheet"], "Total Liabilities");
    const TotalRevenueExcludingInterest = valueCrawler(xls["Profit Loss"], "Total Revenue Excluding Interest");
    const TotalEquity = valueCrawler(xls["Balance Sheet"], "Total Equity");

    const result = 1.2 * (TotalEquity / TotalAssets) + 1.4 * (RetainedEarnings / TotalAssets) + 3.3 * (EBIT / TotalAssets) + 0.6 * (MarketCap / TotalLiabilities) + 1 * (TotalRevenueExcludingInterest / TotalAssets);
    return result;
}

function DeltaPustylnicksPScore(currentXLS, priviousXLS) {
    const result = (PustylnicksPScore(currentXLS) - PustylnicksPScore(priviousXLS)) / PustylnicksPScore(priviousXLS);
    return result;
}

function RealWealthRScore(xls) {
    const OperatingWkgCapital = valueCrawler(xls["Sundry Analysis"], "Operating Wkg Capital");
    const TotalAssets = valueCrawler(xls["Balance Sheet"], "Total Assets");
    const OperatingRevenue = valueCrawler(xls["Profit Loss"], "Operating Revenue");

    const result = 0.15 * (OperatingWkgCapital / TotalAssets) + 0.924 * (OperatingRevenue / TotalAssets);
    return result;
}

function DeltaRealWealthRScore(currentXLS, priviousXLS) {
    const result = (RealWealthRScore(currentXLS) - RealWealthRScore(priviousXLS)) / RealWealthRScore(priviousXLS);
    return result;
}

function PerceivedWealthPScore(xls) {
    const TotalEquity = valueCrawler(xls["Balance Sheet"], "Total Equity");
    const TotalAssets = valueCrawler(xls["Balance Sheet"], "Total Assets");
    const TotalRevenueExcludingInterest = valueCrawler(xls["Profit Loss"], "Total Revenue Excluding Interest");

    const result = 0.367 * (TotalEquity / TotalAssets) + 0.98 * (TotalRevenueExcludingInterest / TotalAssets);
    return result;
}

function DeltaPerceivedWealthPScore(currentXLS, priviousXLS) {
    const result = (PerceivedWealthPScore(currentXLS) - PerceivedWealthPScore(priviousXLS)) / PerceivedWealthPScore(priviousXLS);
    return result;
}

function AcidTestRatio(xls) {
    return valueCrawler(xls["Ratio Analysis"], "Quick Ratio");
}

function CurrentRatio(xls) {
    return valueCrawler(xls["Ratio Analysis"], "Current Ratio");
}

function CashPercentage(xls) {
    return valueCrawler(xls["Asset Base Analysis"], "Cash (%)");
}

function DaysReceivable(xls) {
    return valueCrawler(xls["Ratio Analysis"], "Days Receivables");
}

function ROE(xls) {
    return valueCrawler(xls["Ratio Analysis"], "ROE (%)");
}

function ROA(xls) {
    return valueCrawler(xls["Ratio Analysis"], "ROA (%)");
}

function DebtToEquityRatio(xls) {
    const result = valueCrawler(xls["Balance Sheet"], "Total Liabilities") / valueCrawler(xls["Balance Sheet"], "Total Equity");
    return result;
}