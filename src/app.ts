import 'express-async-errors'
import routes from './routes'
import express, {json} from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.get('/', (req, res) => {
    res.send('Hello world')
})

app.use(json())
app.use('/api', routes)

app.use(function (err, req, res, next) {
    //respond with a 500 server error
    console.error(err);
    res.status(500).send("An error has been ocurred "+ err);
})

export default app
