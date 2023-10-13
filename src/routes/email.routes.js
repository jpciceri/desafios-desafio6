import express from "express";
import { Router } from "express";
import EmailController from "../controllers/email.controller.js";

const emailController = new EmailController();

const emailRouter = Router();

emailRouter.post("/send", emailController.sendEmail);

export default emailRouter;
