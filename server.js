import http from 'http';
import { parse } from 'query-string';

import config from "./config.json";

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

            res.writeHead(302, {
                'Location': `https://docs.google.com/spreadsheets/d/${config.googleSheets.sheet_id}/view`
            });

            res.end();
            
            console.log(result);
        }
    } else {
        res.end(`
            <!doctype html>
            <html>
            <body>
                <form action="/" method="post">
                    <input type="text" name="ASXCode" /><br />
                    <input type="number" name="year" /><br />
                    <button>Submit</button>
                </form>
            </body>
            </html>
        `);
    }
});

server.listen(8080);