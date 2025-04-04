// lib/multer.ts
import multer from 'multer';
//import path from 'path';

// Configurar Multer para guardar archivos en el directorio 'uploads'
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Convertir Multer en un middleware compatible con Next.js
export const uploadMiddleware = upload.single('file');
