const express = require("express");
const { errorHandler } = require("./middlewares/errorMiddleware");
const apiRoutes = require("./routes/pdfRoutes");
const dotenv = require("dotenv");
const cors = require("cors"); 
const connectDb = require("./config/config");

dotenv.config();
connectDb();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("welcome");
});
app.use("/api", apiRoutes);


app.use(errorHandler);

const PORT = 8080;

app.listen(PORT, () => {
  console.log(
    `Server Running in Port ${process.env.PORT}`
      .inverse
  );
});
