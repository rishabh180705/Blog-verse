
import path from "path";
import {app} from './src/app.js';
import {connectDB} from './database/index.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const PORT=5000;

const DB_url = `${process.env.mongo_DB}/blogify`;
connectDB(DB_url)
.then(() => {
    app.listen(process.env.PORT|| 5000, () => {
        console.log(`⚙️ Server is running at port : ${PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
