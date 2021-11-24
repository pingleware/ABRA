# Group 5, A machine learning approach to automating the audit of financial statements

## Installation
- Unzip the repo to its own folder
- Inside the folder run `npm install`
- Rename `config.json.EXAMPLE` to `config.json`
- morningstar login is equal to that of your MQ Uni portal login
- Fill in the googleSheets object with your google sheets API key information (SheetID is the ID of the sheet you wish to save output to)

## Run
```
npm start
```
This will start an automated calculation on every publically listed ASX company and upload it to the google sheet ID provided in `config.json`

```
npm server
```
This will start a webserver at the listed port in `config.json` for manual calculation requests

## License
[MIT](https://choosealicense.com/licenses/mit/)
