const express = require("express");
const cors = require("cors");

require("express-async-errors");
require("dotenv").config();
require("./db");

const morgan = require("morgan");
const { errorHandler } = require("./middlewares/errors");
const { handleNotFound } = require("./utils/helper");
const userRouter = require("./routes/user");
const actorRouter = require("./routes/actor");
const movieRouter = require("./routes/movie");
const reviewRouter = require("./routes/review");
const adminRouter = require("./routes/admin");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/actor", actorRouter);
app.use("/api/movie", movieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);

app.get("/about", (req, res) => {
	res.send("About");
});

app.use("/*", handleNotFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
	console.log("The server is running on port 8000");
});
