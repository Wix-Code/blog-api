import jwt from "jsonwebtoken";

export const verifyToken = (req : any, res : any, next : any) => {
    // Implement token verification logic here

    const token = req.cookies.accessToken;

    // Example token verification using JSON Web Tokens (JWT)
    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch (error) {     
        console.log(error);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
}