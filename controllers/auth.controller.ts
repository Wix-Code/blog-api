import { Prisma } from "@prisma/client"
import prisma from "../lib/prisma"
import bcrypt from "bcrypt"
import validator from "validator"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"


export const register = async (req : any, res : any) => {
    const { email,password, ...others } = req.body;

    // check if user already exists
    const isUserExists = await prisma.user.findUnique({
        where: { email }
    });
    
    if (isUserExists){
        return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // validate email format
    if (!validator.isEmail(email)){
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    
    // check password length here
    if (password.length < 8){
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {

        // create user in the database
        const user = await prisma.user.create({
            data:{
                email,
                password:hashedPassword,
                ...others
            }
        })
        
        return res.status(201).json({ success: true, message: "User registered successfully", user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "User registration failed" });
    }
}

export const login = async (req : any, res : any) => {
    const {email, password} = req.body
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })
        
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const {password, ...info} = user
        // generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        return res.cookie("accessToken", token, { httpOnly: true}).json({ success: true, message: "Login successful", info, token });
    } catch (error) {
        console.log(error);
    }
}

export const forgotPassword = async (req : any, res : any) => {
    const {email} = req.body;

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    try {

        const secret = process.env.JWT_SECRET + user.password;

        const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: "1h" });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset Request",
            text: `To reset your password, visit this link: http://localhost:3000/reset-password/${token}`
        };

        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({ success: true, message: "Password reset email sent successfully" });
     
    } catch (error) {
     console.log(error)
    }
}

export const resetPassword = async (req : any, res : any) => {
    try {
        
    } catch (error) {
        console.log(error)
    }
}

export const logout = async (req : any, res : any) => {
    try {
        res.clearCookie("accessToken").json({
            success: true,
            message: "Logout successful"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Logout failed" });
    }
}

export const userDetailsUpdate = async (req : any, res : any) => {
   try {
    
   } catch (error) {
    console.log(error)
   }
}