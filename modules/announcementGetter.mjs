import { createFolder, savedPDFsDir, databaseKeyExists, databasePDFIdsGet, databasePDFIdsSet, databasePDFIdsAddArray } from './databaseManager.mjs';
import got from 'got';
import { createWriteStream } from 'fs';
import https from "https";

async function getAllConfirmPageIds(companyCode) {
    // Retrieve the last six months worth of announcement hyperlinks
    // https://www2.asx.com.au/markets/trade-our-cash-market/announcements.vrs
    const page = await got(`https://www.asx.com.au/asx/v2/statistics/announcements.do?by=asxCode&asxCode=${companyCode}&timeframe=D&period=M6`);

    // Split into each hyperlink
    const pageSplit = page.body.split("/asx/statistics/displayAnnouncement.do?display=pdf&idsId=");
    
    // The first index is garbage and not needed, it's not a link
    pageSplit.shift();

    const pdfConfirmPageIds = [];

    pageSplit.forEach(text => {
        pdfConfirmPageIds.push(text.slice(0, 8));
    });

    return pdfConfirmPageIds;
}

async function confirmPageIdToFinalURL(id) {
    // Retrieve the confirmation page that sits before the PDF link
    const confirmPage = await got(`https://www.asx.com.au/asx/statistics/displayAnnouncement.do?display=pdf&idsId=${id}`);
    
    // Extract the pdf link from the confirmation page
    const pdfURL = confirmPage.body.split(`<input name="pdfURL" value="`)[1];

    // Append the relative path to a full one
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
    // Create the PDF file and an open stream to send data to
    const file = createWriteStream(`${savedPDFsDir}${companyCode}/${finalURL.slice(43)}`);

    // Create a Promise on the stream so that we can track when it is finished
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
    if (!databaseKeyExists(companyCode)) {
        // Retrieve every PDF file since we have none

        const finalURLs = await confirmPageIdsToFinalURLs(confirmPageIds);

        // Create the folder to save the PDFs into
        createFolder(companyCode);

        // Resolve urls into saved files
        await finalURLsToFiles(finalURLs, companyCode);

        // Update database by creating key and setting it to the confirm page Ids
        databasePDFIdsSet(companyCode, confirmPageIds);

    } else {

        // Compare our database to the websites
        let newConfirmPageIds = confirmPageIds.filter((o) => databasePDFIdsGet(companyCode).indexOf(o) === -1);

        // If any, retrieve all new files
        if (newConfirmPageIds.length !== 0) {
            const finalURLs = await confirmPageIdsToFinalURLs(newConfirmPageIds);

            await finalURLsToFiles(finalURLs, companyCode)

            // Add the new Ids to our database
            databasePDFIdsAddArray(companyCode, newConfirmPageIds);
        }
    }

    return 1;
}