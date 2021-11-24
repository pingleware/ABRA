import { savedPDFsDir } from './databaseManager.mjs';
import https from "https";
import { createWriteStream, existsSync, readFileSync } from 'fs';

const url = `https://www.asxlistedcompanies.com/uploads/csv/20200501-asx-listed-companies.csv`
const path = `${savedPDFsDir}/listedCompanies.txt`;

async function downloadListed() {

    if (!existsSync(path)) {
        const file = createWriteStream(path);

        return new Promise((resolve, reject) => {
            https.get(url, res => {
                res.pipe(file)
                .on('finish', () => {
                    resolve();
                })
                .on('error', (err) => {
                    reject(err);
                });
            });
        });
    }

    return 0;
}

export async function getListed() {
    await downloadListed();
    let data = readFileSync(path).toString().split("\n");
    
    for(let i = 0; i < data.length; i++) {
        data[i] = data[i].split(`,`)[0];
    }

    return data.slice(2);
}