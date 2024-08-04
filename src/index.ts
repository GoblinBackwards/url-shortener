import express, { Express, Request, Response } from 'express'
import multer from 'multer'

const app = express()
const port = 3000
const upload = multer()

type FormBody = {
    url: string,
    authkey: string
}

app.use(express.static('public'))

app.post('/', upload.none(), (req: Request, res: Response) => {
    const validkeys = ['meow', 'moo']
    const body: FormBody = req.body;
    console.log(body)
})

app.get('/link/', (req: Request, res: Response) => {
    res.send('redirect...');
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})