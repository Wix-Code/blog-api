import express, { response } from "express"

const app = express();

app.get( "/", (req : any, res : any) => {
    res.send({message: "api is running"})
})
app.listen(5000, () => {
    console.log("Server running on port 5000");
})