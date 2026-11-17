import multer from "multer"
import fs from "fs"
import path from "path"
import AppError, { ErrorDictionary } from "../utils/errors.js"

/**
 * Como evitar que la falta de destino del archivo rompa con el server
 */

function ensureDir(dir){
    fs.mkdirSync(dir, {recursive: true})
}

function buildStorage(destinationFolder){
    ensureDir(destinationFolder)
    return multer.diskStorage({
        destination: (req, file, cb) => cb(null, destinationFolder),
        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname)//dni.dwadw.grgdrgd.jpg
            const fileName = `${Date.now()}-${Math.round(Math.random()* 1e9)}${extension}`//156146515615-1561651861531.jpg
            cb(null, fileName) 
            /**
             * {
             *  originalname: dni.dwadw.grgdrgd.jpg
             *  filename: 156146515615-1561651861531.jpg
             * 
             * extension: jpg
             * mimetype: image/jgp image/webp 
             * }
             */
        }
    })
}

const ALLOWED_MIME_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp"
]

/**filtros y limites */
function fileFilter(req, file, cb){
    if(ALLOWED_MIME_TYPES.includes(file.mimetype)){
        cb(null, true)
        return
    }
    cb(AppError(ErrorDictionary.INVALID_FILE_TYPE))
}

const limits = {
    fileSize:  5 * 1024 * 1024
}

/**
 * buildStorage("/documents")
 * buildStorage("/receipt")
 */

export const uploadDocument = multer({
    storage: buildStorage("uploads/documents"),
    fileFilter,
    limits
})

export const uploadProof = multer({
    storage: buildStorage("uploads/proofs"),
    fileFilter,
    limits
})