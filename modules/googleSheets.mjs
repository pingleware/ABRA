import { GoogleSpreadsheet } from 'google-spreadsheet';

import config from "../config.json";

const doc = new GoogleSpreadsheet(config.googleSheets.sheet_id);

await doc.useServiceAccountAuth({
    client_email: config.googleSheets.client_email,
    private_key: config.googleSheets.private_key,
  });

await doc.loadInfo(); // loads document properties and worksheets
console.log(doc.title);

const sheet = await doc.sheetsByIndex[0];

await sheet.loadCells('A1:A1')

const a1 = sheet.getCell(0, 0);

console.log(a1.value);
//https://theoephraim.github.io/node-google-spreadsheet/#/