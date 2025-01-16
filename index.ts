import express, { response } from "express"
import authUsers from "../server/routes/auth.route"
import postBlog from "../server/routes/post.route"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config();

const app = express();

app.use(express.json())
app.use(cors())


app.get( "/", (req : any, res : any) => {
    res.send({message: "api is running"})
})

app.use("/api/auth", authUsers)
//app.use("/posts", postBlog)
app.use("/api/posts", postBlog)

app.listen(5000, () => {
    console.log("Server running on port 5000");
})