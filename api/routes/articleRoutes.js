import { Router } from "express";
import { getArticleData } from "../controllers/articleController.js";

const router = Router();

// Route for scraping article data
router.get("/", getArticleData);

export default router;
