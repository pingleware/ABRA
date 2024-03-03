import { savedPDFsDir } from './databaseManager.mjs';
import excelToJson from 'convert-excel-to-json';

function xlsFileToText(fileLoc) {
    return excelToJson({ sourceFile: fileLoc });
}

export function extractXLS(companyCode, years) {
    const XLSsToReturn = {};

    years.forEach(year => {
        XLSsToReturn[year] = xlsFileToText(`${savedPDFsDir}/${companyCode}/${year}.xls`);
    });

    return XLSsToReturn;
}