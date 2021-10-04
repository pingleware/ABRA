import { createFolder, savedPDFsDir, databaseKeyExists, databaseXLSYearsGet, databaseXLSYearsSet, databaseXLSYearsAddArray } from './databaseManager.mjs';
import Nightmare from "nightmare";
import https from "https";
import { createWriteStream } from 'fs';

import login from "../loginInfo.json";

const nightmare = Nightmare({ show: false });

const host = `datanalysis-morningstar-com-au.simsrad.net.ocs.mq.edu.au`;

export async function downloadXLS(companyCode, years) {
    if(!databaseKeyExists(companyCode)) {
        createFolder(companyCode);

        const cookieValue = await getCookieValue();

        const XLSPromises = [];

        years.forEach(year => {
            XLSPromises.push(downloadXLSByYear(cookieValue, companyCode, year));
        });

        await Promise.all(XLSPromises);

        databaseXLSYearsSet(companyCode, years);

    } else {

        let newConfirmXLSYears = years.filter((o) => databaseXLSYearsGet(companyCode).indexOf(o) === -1);

        if (newConfirmXLSYears.length !== 0) {
            const cookieValue = await getCookieValue();

            const XLSPromises = [];

            newConfirmXLSYears.forEach(year => {
                XLSPromises.push(downloadXLSByYear(cookieValue, companyCode, year));
            });

            await Promise.all(XLSPromises);

            databaseXLSYearsAddArray(companyCode, years);
        }

    }
    
    return 1;
}

async function downloadXLSByYear(cookie, companyCode, year) {
    const options = {
        hostname: host,
        path: `/ftl/company/financialdownload?xsl_dltab=financial10yrs&downloadfile=financialxls&download=xls&filetype=xls&ASXCode=${companyCode}&rt=A&sy=${year}-01-01&ey=${year}-12-31&xtm-licensee=datpremium`,
        method: 'GET',
        headers: {'Cookie': `ezproxy=${cookie}`}
    }

    return finalURLToFile(options, companyCode, year);
}

async function getCookieValue() {
    const cookies = await nightmare
	.goto(`https://` + host + `/af/dathome?xtm-licensee=datpremium`)
    .wait('#okta-signin-username')
    .type('#okta-signin-username', login.user)
    .type('#okta-signin-password', login.pass)
    .click('#okta-signin-submit')
    .wait('#Companies-Result-Content')
    .cookies.get()
    .end();

    return cookies[0].value;
}

async function finalURLToFile(options, companyCode, year) {
    // Create the XLS file and an open stream to send data to
    const file = createWriteStream(`${savedPDFsDir}${companyCode}/${year}.xls`);

    // Create a Promise on the stream so that we can track when it is finished
    return new Promise((resolve, reject) => {
        https.get(options, res => {
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