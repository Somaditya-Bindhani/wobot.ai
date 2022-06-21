const express = require('express')
const app = express();
const dotenv = require('dotenv');
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fastCsv = require('fast-csv')
const fs = require('fs');

dotenv.config({path:'./config.env'});

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json());

const connection = require('./db/conn')
// const csv = require('./csv/csv')

app.use(require('./router/router'));

app.get((req,res) => {
    res.send(`Hello`);
})

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads/')    
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});

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
// const pathCsv = path.resolve(__dirname, 'users.csv')

app.post('/uploadfile', upload.single("uploadfile"), (req, res) =>{
    readCSV(__dirname + '/uploads/' + req.file.filename);
    console.log('CSV file data has been uploaded in mysql database ' + err);
});

app.listen(PORT,() => {
    console.log(`server started on port ${PORT}`)
})