const fs = require('fs');
const dir = 'C:/Users/steph/OneDrive/Desktop/json/'; // Directory of JSON

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const folderHasMetadata = true;

// Count how many files
fs.readdir(dir, (err, files) => {
    const SIZE = files.length - (folderHasMetadata ? 1 : 0);
    console.log(`Size: ${SIZE}`);

    // Get Headers from first json
    const jsonData = fs.readFileSync(`${dir}0.json`);
    const parsedJson = JSON.parse(jsonData);
    const tempAttributeHeaders = parsedJson.attributes.map(attribute => attribute.trait_type);
    let attributeHeaders = [];
    tempAttributeHeaders.forEach(attribute => {
        attributeHeaders.push({
            id: attribute,
            title: attribute
        })
    });

    let headers = [
        {id: 'name', title: 'name'},
        {id: 'description', title: 'description'},
        {id: 'edition', title: 'edition'},
        {id: 'date', title: 'date'},
        ...attributeHeaders
    ];

    const csvWriter = createCsvWriter({
        path: 'output/metadata.csv',
        header: headers
    });

    const records = [];
    for (let i = 0; i < SIZE; i++) {
        const jsonData = fs.readFileSync(`${dir}${i}.json`);
        const parsedJson = JSON.parse(jsonData);
        let attributesObj = {};
        parsedJson.attributes.forEach((attribute, idx) => {
            attributesObj[attribute.trait_type] = attribute.value;
        })
        records.push({
            name: parsedJson.name,
            description: parsedJson.description,
            edition: parsedJson.edition,
            date: Math.floor((new Date()).getTime() / 1000),
            ...attributesObj
        });
    }

    csvWriter.writeRecords(records)    
    .then(() => {
        console.log(`Done! Check the output folder`);
    });

    //Math.floor((new Date()).getTime() / 1000)
    //const attributes = metadata[0].attributes.map((attribute, idx) => attribute.trait_type)
});