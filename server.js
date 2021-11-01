import http from 'http';
import { parse } from 'query-string';

import { trainModel, createResult } from './modules/nn.mjs';

import config from "./config.json";

function makePage(suffix = ``, ASXCode = ``, year = ``) {
    return `
    <!doctype html>
    <html>
    <body>
        <form action="/" method="post">
            <input type="text" name="ASXCode" value="${ASXCode}" /><br />
            <input type="number" name="year" value="${year}" /><br />
            <button>Submit</button>
            <a href="https://docs.google.com/spreadsheets/d/${config.googleSheets.sheet_id}/view">Results Overview</a>
            <p>${suffix}</p>
        </form>
    </body>
    </html>
`;
}

const server = http.createServer(async (req, res) => {
    if (req.method === 'POST') {
        if(req.headers['content-type'] === 'application/x-www-form-urlencoded') {
            const result = await new Promise((resolve, reject) => {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    resolve(parse(body));
                });
            });

            result.ASXCode = result.ASXCode.toUpperCase();
            result.year = parseInt(result.year);

            const confidence = await createResult(result.ASXCode, result.year);

            if (isNaN(confidence)) {
                res.end(makePage(`Could not acquire all necessary information.`, result.ASXCode, result.year));
            } else {
                /*
                res.writeHead(302, {
                    'Location': `https://docs.google.com/spreadsheets/d/${config.googleSheets.sheet_id}/view`
                });
                */
                res.end(makePage(`Fraud confidence percentage: ${confidence}%`, result.ASXCode, result.year));
            }
            
        }
    } else {
        res.end(makePage());
    }
});

await trainModel();

server.listen(config.ABRA.port);