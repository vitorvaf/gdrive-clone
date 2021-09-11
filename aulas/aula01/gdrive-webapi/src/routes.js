import { logger } from "./logger.js";
import FileHelper from './fileHelper';
import { dirname, resolve } from 'path';
import { fileURLToPath } from "url";

const __dirnname = dirname(fileURLToPath(import.meta.url));
const defaultDownloadsFolder = resolve(__dirnname, '../', "downloads")

export default class Routes {
    io
    constructor(downloadFolder = defaultDownloadsFolder){
        this.downloadFolder = downloadFolder
        this.fileHelper = FileHelper
    }

    setSocketInstance(io){
        this.io = io;
    }

    async defaultRouter(request, response) {
        response.end('hello word');
    }
    
    async options(request, response) {
        response.writeHead(204);
        response.end();
    }
    
    async post(request, response) {        
        logger.info('post')
        response.end();
    }
    
    async get(request, response) {        
        const files = await this.fileHelper.getFilesStatus(this.downloadFolder)

        response.writeHead(200)
        response.end(JSON.stringify(files));
    }

    handler(request, response) {
        response.setHeader('Acess-Control-Allow-Origin', '*')
        const chosen = 
            this[request.method.toLowerCase()] || 
            this.defaultRouter

        return chosen.apply(this, [request, response])
    }
}