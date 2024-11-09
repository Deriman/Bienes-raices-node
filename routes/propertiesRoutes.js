import express  from "express";
import { adminPanel } from "../controllers/propertyController.js";

const router = express.Router()

router.get('/my-properties', adminPanel)

export default router