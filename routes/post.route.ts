import express from "express";
import { createBlog } from "../controllers/post.controller";

const router = express.Router();

router.post("/", createBlog)

export default router;