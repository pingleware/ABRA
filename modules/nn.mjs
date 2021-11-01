import limdu from 'limdu';

import { downloadXLS, getCookieValue } from './financialGetter.mjs';
import { createMarkersObject } from './financialAlgorithms.mjs';
import { extractXLS } from './xlsExtract.mjs';

import config from "../config.json";

const model = new limdu.classifiers.NeuralNetwork();
const downloadCookie = await getCookieValue();

export async function trainModel() {
    await downloadTrainingData();
    extractTrainingDataForTraining();
}

async function downloadTrainingData() {
    const trainDataPromises = [];

    config.trainList.forEach(item => {
        trainDataPromises.push(downloadXLS(item.code, [item.year - 1, item.year], downloadCookie));
    });

    await Promise.all(trainDataPromises);
}

function extractTrainingDataForTraining() {
    const formattedTrainingData = [];

    config.trainList.forEach(item => {
        const XLSData = extractXLS(item.code, [item.year - 1, item.year]);
        formattedTrainingData.push({
            input: createMarkersObject(XLSData[item.year], XLSData[item.year - 1]),
            output: item.output
        });
    });

    model.trainBatch(formattedTrainingData);
}

export async function createResult(companyCode, year) {
    await downloadXLS(companyCode, [year - 1, year], downloadCookie);

    const XLSData = extractXLS(companyCode, [year - 1, year]);

    const markers = createMarkersObject(XLSData[year], XLSData[year - 1]);

    return (Math.round(model.classify(markers) * 1e4 ) / 1e2);
}