import express, { Express, Request, Response } from 'express'
import multer from 'multer'
require('dotenv').config()
import sqlite3 from 'sqlite3'
const db = new sqlite3.Database('database.sqlite')

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS auth (authkey TEXT)')
    db.run('CREATE TABLE IF NOT EXISTS link (key TEXT, fullurl TEXT)')
})

const app = express()
const port = 3000
const upload = multer()

type FormBody = {
    url: string,
    authkey: string
}

type DbRowAuth = {
    authkey: string
}

type DbRowLink = {
    key: string,
    fullurl: string
}

app.use(express.static('public'))

app.post('/', upload.none(), async (req: Request, res: Response) => {
    db.all('SELECT * FROM auth', (err, rows: DbRowAuth[]) => {
        const form: FormBody = req.body;
        const authenticated: boolean = rows.map(r => r.authkey).includes(form.authkey);

        if (authenticated) {
            res.status(200).send('new link').end();
        } else {
            res.status(403).end();
        }
    });
})

app.get('/link/', (req: Request, res: Response) => {
    res.send('redirect...');
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})