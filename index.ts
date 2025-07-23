import 'dotenv/config';
import express from "express";
import router from "./routes/route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("server started")
});

app.use(router);

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});