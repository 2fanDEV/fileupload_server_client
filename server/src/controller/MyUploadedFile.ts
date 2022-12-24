import fs from 'fs';
class MyUploadedFile {

    fileName : string;

    data: any;

    type: string;
    uploadedDate: number;

    constructor(fileName : string, data : any, type : string)
    {
        this.fileName = fileName;
        this.data = data;
        this.type = type;
        this.uploadedDate = Date.now();
    }

    getFileName() : string {
        return this.fileName;
    }

    getFile(fileName: string) {
        fs.readFile('./files/' + fileName, function(err, data) {
            if(err) {
                throw err;
            }
            const content = data;
            console.log(content);
        });
    }

    getFileInfo() : string {
        return `
            fileName: ${this.fileName}
            type: ${this.type}
            uploadedDate: ${this.uploadedDate}
        `
    }
}

export = MyUploadedFile;