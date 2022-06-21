const fs = require('fs')
const path = require('path')
const fastCsv = require('fast-csv')
const readCSV = (csvFilePath) => {
  const readData = fs.createReadStream(csvFilePath)
  const data = []
  readData
    .pipe(fastCsv.parse())
    .on('data', (row) => {
      data.push(row)
      console.log('Name:', row[0])
      console.log('Email:', row[1])
      console.log('City:', row[2])
      console.log('\n')
    })
    .on('end', (rowCount) => {
      console.log(`${rowCount} rows parsed!`)
      console.log(data)
    })
    .on('error', (e) => console.error(e))
}
const pathCsv = path.resolve(__dirname, 'users.csv')
readCSV(pathCsv)