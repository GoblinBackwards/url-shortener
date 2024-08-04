const express = require('express')
const multer = require('multer')
const bodyParser = require('multer')

const app = express()
const port = 3000
const upload = multer()

app.use(express.static('public'))

app.post('/', upload.none(), (req, res) => {
    const validkeys = ['meow', 'moo']
    const body = req.body;
    const url = body.url;
    const authkey = body;
    console.log(body)
    console.log(authkey)
    console.log(validkeys.includes(authkey));
})

app.get('/link/', (req, res) => {
    res.send('redirect...');
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})