import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import { uploadDocument } from '../middlewares/upload.middleware.js';
const router = Router();

router.get('/', usersController.findAll);
router.get('/:id', usersController.findById);
router.post('/', usersController.create);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);
router.post("/:id/documents", uploadDocument.single("document"), usersController.uploadDocument)
/*
router.post("/:id/documents",uploadDocument.array("document", 2), usersController.uploadDocument)

router.post("/:id/documents",uploadDocument.fields([
    {name: "documents", maxCount: 1}, {name: "proofs", maxCount: 5}
]), usersController.uploadDocument)
*/
export default router;


/**
 * multer.single (req.file) = {
      fieldname: 'documents',
      originalname: 'FacturaAySA0111B27300779A.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      path: 'uploads\\documents\\1794674003231-324539333.pdf',
      destination: 'uploads/documents',
      filename: '1794674003231-324539333.pdf',
      size: 1022223
    }

    multer.array (req.files) = [
    {
      fieldname: 'documents',
      originalname: 'FacturaAySA0111B27300779A.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      path: 'uploads\\documents\\1794674003231-324539333.pdf',
      destination: 'uploads/documents',
      filename: '1794674003231-324539333.pdf',
      size: 1022223
    },
    {
      fieldname: 'documents',
      originalname: 'FacturaAySA0111B27300779A.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      path: 'uploads\\documents\\1794674003231-324539333.pdf',
      destination: 'uploads/documents',
      filename: '1794674003231-324539333.pdf',
      size: 1022223
    }
  ]

  multer.fields (req.files) =  {
  documents: [
    {
      fieldname: 'documents',
      originalname: 'FacturaAySA0111B27300779A.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      path: 'uploads\\documents\\1794674003231-324539333.pdf',
      destination: 'uploads/documents',
      filename: '1794674003231-324539333.pdf',
      size: 1022223
    }
  ],
  proofs: [
    {
      fieldname: 'proofs',
      originalname: 'FacturaAySA0111B27300779A.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      path: 'uploads\\documents\\1794674003236-296283560.pdf',
      destination: 'uploads/documents',
      filename: '1794674003236-296283560.pdf',
      size: 1022223
    },
    {
      fieldname: 'proofs',
      originalname: 'FacturaAySA0111B27300779A.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      path: 'uploads\\documents\\1794674003241-586895175.pdf',
      destination: 'uploads/documents',
      filename: '1794674003241-586895175.pdf',
      size: 1022223
    }
  ]
}
 */