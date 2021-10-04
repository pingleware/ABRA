import { writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';

export const savedPDFsDir = `./savedPDFs/`;
const databaseLoc = `${savedPDFsDir}database.json`;

initialiseDatabase();

export let { default: database } = await import(`.${databaseLoc}`);

function initialiseDatabase() {
    if (!existsSync(savedPDFsDir)){
        mkdirSync(savedPDFsDir);
    }

    if (!existsSync(databaseLoc)) {
        writeFileSync(databaseLoc, `{}`);
    }
}

export function updateDatabase() {
    writeFileSync(databaseLoc, JSON.stringify(database));
}

export function databaseKeyExists(companyCode) {
    if (database[companyCode] !== undefined) {
        return true;
    } else {
        databaseKeyCreate(companyCode);
        return false;
    }
}

function databaseKeyCreate(companyCode) {
    database[companyCode] = {PDFIds: [], XLSYears: []};
    updateDatabase();
}

export function databasePDFIdsExists(companyCode) {
    return database[companyCode].PDFIds === undefined;
}

export function databaseXLSYearsExists(companyCode) {
    return database[companyCode].XLSYears === undefined;
}

export function databasePDFIdsGet(companyCode) {
    return database[companyCode].PDFIds;
}

export function databaseXLSYearsGet(companyCode) {
    return database[companyCode].XLSYears;
}

export function databasePDFIdsSet(companyCode, pageIds) {
    database[companyCode].PDFIds = pageIds;
    updateDatabase();
}

export function databaseXLSYearsSet(companyCode, XLSYears) {
    database[companyCode].XLSYears = XLSYears;
    updateDatabase();
}

export function databasePDFIdsAddArray(companyCode, pageIds) {
    database[companyCode].PDFIds.push(...pageIds);
    updateDatabase();
}

export function databaseXLSYearsAddArray(companyCode, XLSYears) {
    database[companyCode].XLSYears.push(...XLSYears);
    updateDatabase();
}

export function createFolder(companyCode) {
    mkdirSync(`${savedPDFsDir}${companyCode}`, { recursive: true });
}

export function getAllFilePaths(companyCode) {
    return readdirSync(`${savedPDFsDir}${companyCode}`).map(i => `${savedPDFsDir}${companyCode}/` + i);
}