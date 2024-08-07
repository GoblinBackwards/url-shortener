import express, { Express, Request, Response } from 'express'
import { DbRowAuth, DbRowLink, FormBody } from './types'
import multer from 'multer'
import crypto from 'crypto'
require('dotenv').config()
import sqlite3 from 'sqlite3'
const db = new sqlite3.Database('database.sqlite')

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS auth (authkey TEXT, UNIQUE(authkey))')
    db.run('CREATE TABLE IF NOT EXISTS link (key TEXT, fullurl TEXT, last_accessed INTEGER, UNIQUE(key))')
    db.run('INSERT OR IGNORE INTO auth (authkey) VALUES ($key)', {
        "$key": process.env.DEFAULT_AUTHKEY
    })
})

const app = express()
const port = 3000
const upload = multer()

app.use(express.static('public'))

app.post('/', upload.none(), async (req: Request, res: Response) => {
    db.all('SELECT * FROM auth', (err, rows: DbRowAuth[]) => {
        const form: FormBody = req.body;
        const authenticated: boolean = rows.map(r => r.authkey).includes(form.authkey);

        if (authenticated) {
            const stmt = db.prepare('INSERT OR IGNORE INTO link (key, fullurl, last_accessed) VALUES ($key, $fullurl, unixepoch())')
            const base64 = genBase64Str(10);
            let url = form.url
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = "http://" + url;
            }
            stmt.run({ "$key": base64, "$fullurl": url })
            res.status(200).send(base64).end();
        } else {
            res.status(403).end();
        }
    });
})

app.get('/:base64link', (req: Request, res: Response) => {
    const base64 = req.params.base64link;
    if (base64 == null) {
        res.redirect('/');
        return;
    }
    db.get('SELECT * FROM link WHERE key = ?', base64, (err, row: DbRowLink) => {
        if (row == null) {
            res.redirect('/');
            return;

        }
        res.redirect(row.fullurl);
        db.run('UPDATE link SET last_accessed = unixepoch() WHERE key = $key', { '$key': base64 });
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

const deleteInterval = 30 * 60 * 1000; // run every 30 minutes
setInterval(() => {
    db.run('DELETE FROM link WHERE last_accessed + 604800 < unixepoch()'); // delete older than 1 week
}, deleteInterval)

function genBase64Str(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-="
    const intArr = crypto.getRandomValues(new Uint8Array(length));
    const charArr = []
    for (const i of intArr) {
        const n = Math.floor(i / 4)
        charArr.push(chars[n]);
    }
    return charArr.join("");
}