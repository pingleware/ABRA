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

export function createFolder(companyCode) {
    mkdirSync(`${savedPDFsDir}${companyCode}`, { recursive: true });
}

export function getAllFilePaths(companyCode) {
    return readdirSync(`${savedPDFsDir}${companyCode}`).map(i => `${savedPDFsDir}${companyCode}/` + i);
}