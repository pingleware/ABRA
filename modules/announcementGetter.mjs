import got from 'got';
import fs from 'fs';
import https from "https";
import pdf from 'pdf-extraction';
import stream from 'stream';

async function pdfURLS(companyCode) {
    const page = await got(`https://www.asx.com.au/asx/v2/statistics/announcements.do?by=asxCode&asxCode=${companyCode}&timeframe=D&period=M6`);
    const pageSplit = page.body.split("/asx/statistics/displayAnnouncement.do?display=pdf&idsId=");

    pageSplit.shift();

    const pdfConfirmPagePromises = [];

    pageSplit.forEach(text => {
        const confirmPageURL = `https://www.asx.com.au/asx/statistics/displayAnnouncement.do?display=pdf&idsId=${text.slice(0, 8)}`;
        pdfConfirmPagePromises.push(got(confirmPageURL));
    });

    const confirmPages = await Promise.all(pdfConfirmPagePromises);

    const returnURLs = [];

    confirmPages.forEach(page => {
        const item = page.body.split(`<input name="pdfURL" value="`)[1];
        returnURLs.push(`https://www.asx.com.au${item.slice(0, 39)}`);
    })

    return returnURLs;
}

async function URLsToFile(urls) {
    urls.forEach(url => {
        const file = fs.createWriteStream(`../savedPDFs/${url.slice(43)}`);
        https.get(url, res => {
            res.pipe(file);
        });
    });
}

async function URLsToArray(urls) {
    urls.forEach(async url => {
        const file = new stream.Readable();
        https.get(url, res => {
            res.pipe(file);
        });
        console.log(await file);
        pdf(file).then(data => {
            console.log(data.text);
            //return data.text;
        });
    });
}

//console.log(await pdfURLS("vrs"));
URLsToArray([`https://www.asx.com.au/asxpdf/20210921/pdf/450qlgprdgs195.pdf`]);