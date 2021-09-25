import { database, updateDatabase, createFolder, savedPDFsDir } from './databaseManager.mjs';
import got from 'got';
import { createWriteStream } from 'fs';
import https from "https";

async function getAllConfirmPageIds(companyCode) {
    const page = await got(`https://www.asx.com.au/asx/v2/statistics/announcements.do?by=asxCode&asxCode=${companyCode}&timeframe=D&period=M6`);
    const pageSplit = page.body.split("/asx/statistics/displayAnnouncement.do?display=pdf&idsId=");

    pageSplit.shift();

    const pdfConfirmPageIds = [];

    pageSplit.forEach(text => {
        pdfConfirmPageIds.push(text.slice(0, 8));
    });

    return pdfConfirmPageIds;
}

async function confirmPageIdToFinalURL(id) {
    const confirmPage = await got(`https://www.asx.com.au/asx/statistics/displayAnnouncement.do?display=pdf&idsId=${id}`);
    const pdfURL = confirmPage.body.split(`<input name="pdfURL" value="`)[1];
    return `https://www.asx.com.au${pdfURL.slice(0, 39)}`;
}

async function confirmPageIdsToFinalURLs(confirmPageIds) {
    // Store confirmation page promises
    const finalURLsPromises = [];

    // Begin loading every confirmation page asynchronously
    confirmPageIds.forEach(id => {
        finalURLsPromises.push(confirmPageIdToFinalURL(id));
    });

    // Wait for all confirm pages to load and return a result
    return await Promise.all(finalURLsPromises);
}

async function finalURLToFile(finalURL, companyCode) {
    const file = createWriteStream(`${savedPDFsDir}${companyCode}/${finalURL.slice(43)}`);
    return new Promise((resolve, reject) => {
        https.get(finalURL, res => {
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

async function finalURLsToFiles(finalURLs, companyCode) {
    // Store PDF file promises
    const PDFPromises = [];

    // Begin download of every file asynchronously 
    finalURLs.forEach(finalURL => {
        PDFPromises.push(finalURLToFile(finalURL, companyCode));
    });

    // Wait for all files to finish downloading
    await Promise.all(PDFPromises);
}

export async function downloadPDFs(companyCode) {
    // Regardless of if we have all the PDFs or not, we need the latest info
    // Scrapes website for every confirmation page Id
    const confirmPageIds = await getAllConfirmPageIds(companyCode);

    // Check if code already exists in database
    if (database[companyCode] === undefined) {
        // Retrieve every PDF file since we have none

        const finalURLs = await confirmPageIdsToFinalURLs(confirmPageIds);

        // Create the folder to save the PDFs into
        createFolder(companyCode);

        // Resolve urls into saved files
        await finalURLsToFiles(finalURLs, companyCode);

        // Update database by creating key and setting it to the confirm page Ids
        database[companyCode] = confirmPageIds;
        updateDatabase();

    } else {

        // Compare our database to the websites
        let newConfirmPageIds = confirmPageIds.filter((o) => database[companyCode].indexOf(o) === -1);

        // If any, retrieve all new files
        if (newConfirmPageIds.length !== 0) {
            const finalURLs = await confirmPageIdsToFinalURLs(confirmPageIds);

            await finalURLsToFiles(finalURLs, companyCode)

            // Add the new Ids to our database
            database[companyCode].push(...newConfirmPageIds);
            updateDatabase();
        }
    }

    return 1;
}