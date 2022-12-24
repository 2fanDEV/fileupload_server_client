import express, {Express, Request, Response} from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import MyUploadedFile from './src/controller/MyUploadedFile';
import fs from 'fs';
import {randomUUID} from "crypto";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true } ))
app.use(bodyParser.raw())
app.use(bodyParser.text())
app.use(cors());

app.use(fileUpload({
    createParentPath: true,
}))

app.get('/', (req: Request, res : Response) => {
    console.log("🔔 incoming POST request at /")
    res.send("Express + TypeScript Server");
})

app.post("/fileUpload", (request: Request, response: Response) => {
    console.log("🔔 incoming POST request at /fileUpload")
    console.log(request.files);
    const files : any = request.files;

    let currentFile : MyUploadedFile = new MyUploadedFile(files['file'].name, files['file'].data, files['file'].mimetype);
    console.log(currentFile.getFileInfo());



    if(fs.existsSync('./src/files/' + files['file'].name))
    {
        files['file'].name = randomUUID() + "." + files['file'].mimetype.replace(/(.*?)\//gm, '');
    }

    fs.writeFileSync('./src/files/' + files['file'].name, files['file'].data);

    response.send("file was uploaded successfull");
})

app.get("/getAllUploadedFiles", (request: Request, response: Response) => {
    let filesArr : string[] = fs.readdirSync("./src/files");
    response.send(filesArr);
})

app.get("/getUploadedFile", (request: Request, response: Response) => {
    let filename = request.query['filename'];
    let file : Buffer;
    try{
        if(fs.existsSync('./src/files/' + filename))
            response.download('./src/files/' + filename);
        else
            reportError('File does not exist');
    } catch(e)
    {
        response.send('File does not exist');
    }
})

app.listen(port, () => {
    console.log(`⚡[server]: Server is running at http://localhost:${port}`)
})

