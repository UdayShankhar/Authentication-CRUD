const express = require("express")
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors");
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")

const port = process.env.PORT || 8000

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('DB connection successful');
    }).catch((err) => {
        console.log(err);
    })

app.use(cors())
app.use(express.json())

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)

app.get("/", (req, res) => {
    res.send('Node JS Backend')
})

app.listen(port, () => {
    console.log('Server is running at 8000');
})