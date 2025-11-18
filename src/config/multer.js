import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads"); 
    },
    filename: function (req, file, cb) {
        const nombreFinal = Date.now() + "_" + file.originalname;
        cb(null, nombreFinal);
    }
});

export const upload = multer({ storage });