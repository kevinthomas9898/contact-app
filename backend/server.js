const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");
const { connectDB } = require("./config/dbConnections");
const dotenv = require("dotenv").config();

connectDB();
const app = express();
app.use(cors());

const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/UserRoutes"));
app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
