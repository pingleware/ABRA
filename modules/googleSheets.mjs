import { GoogleSpreadsheet } from 'google-spreadsheet';

import config from "../config.json";

const doc = new GoogleSpreadsheet(config.googleSheets.sheet_id);

await doc.useServiceAccountAuth({
    client_email: config.googleSheets.client_email,
    private_key: config.googleSheets.private_key,
  });

await doc.loadInfo();
const sheet = await doc.sheetsByIndex[0];

let counter = 1;

export async function initSheet(size) {
  await sheet.loadCells(`A1:B${size}`);
  sheet.getCell(0, 0).value = 'ASX Code';
  sheet.getCell(0, 1).value = 'Confidence (%)';
  await sheet.saveUpdatedCells();
}

export async function saveCellToSheet(ASXCode, confidence) {
  const codeCell = sheet.getCell(counter, 0);
  const confidenceCell = sheet.getCell(counter, 1);

  codeCell.value = ASXCode;
  confidenceCell.value = confidence;

  counter++;
  if (counter % 10 === 0) {
    await sheet.saveUpdatedCells();
  }
}