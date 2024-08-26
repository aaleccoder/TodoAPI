import express from "express";
import {configDotenv} from "dotenv"
import user from "./routes/user.routes";
configDotenv();
import { LocalStorage } from "node-localstorage";
import crud from "./routes/crud.routes";


const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/user', user)
app.use('/todo', crud);


app.listen(PORT, () => {console.log(`Listening on http://localhost:${PORT}`)});