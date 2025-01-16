import { Prisma } from "@prisma/client"
import prisma from "../lib/prisma"
import bcrypt from "bcrypt"
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
    if (email != "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"){
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
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        return res.json({ success: true, message: "Login successful", token });
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req : any, res : any) => {
    try {
        
    } catch (error) {
        
    }
}