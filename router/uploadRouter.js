import Router from 'express'
import { UploadService } from '../controller/uploadController.js'
import { upload } from '../config/multer.js'

const router = Router()

router.post('/api/upload',upload.single('file'),UploadService)


export default router