import express from 'express'
import cors from 'cors'
import productR from './routers/productR' //buat baru
import userR from './routers/userR'
import orderR from "./routers/orderR";
import { log } from 'console'
import md5 from 'md5'
import path from 'path';


const PORT: number = 5000
const app = express()
app.use(cors())

app.use(`/user`,userR)
app.use(`/product`,productR) //buat baru
app.use(`/order`,orderR)


//set public folder as static
app.use(express.static(path.join(__dirname,'..','public')))

app.listen(PORT, () => {
    console.log(`[Server]: Server is running at http://localhost:${PORT}`);
}) 