import express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as dotenv from "dotenv";
import {Form} from "./forms/form";

dotenv.config();

const app: express.Application = express();
const port = 8080;
const httpServer = http.createServer(app);

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3001")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    next();
}) 

app.set('trust proxy', true)

app.post('/contact_form', (req: express.Request, res: express.Response)=>{
    console.log(req.body)
    const form = new Form();
    form.submit(req.body, res);
});

httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});