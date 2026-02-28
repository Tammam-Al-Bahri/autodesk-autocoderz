import * as multer from "multer";

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fieldSize: 200 * 1024 * 1024 }, // 200 MB
});
