import express  from "express";
import { adminPanel, create } from "../controllers/propertyController.js";

const router = express.Router()

router.get('/my-properties', adminPanel)
router.get('/my-properties/create', create)

export default router