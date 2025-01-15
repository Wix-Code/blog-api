import express, { response } from "express"
import postBlog from "../server/routes/post.route"
import cors from "cors"

const app = express();

app.use(express.json())
app.use(cors())


app.get( "/", (req : any, res : any) => {
    res.send({message: "api is running"})
})

app.use("/posts", postBlog)

app.listen(5000, () => {
    console.log("Server running on port 5000");
})