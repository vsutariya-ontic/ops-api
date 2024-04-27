import cookieParser from "cookie-parser";
import cors from "cors";
import { configDotenv } from "dotenv";
import express from "express";
import { PORT } from "./constants/constants";
import { disconnectFromMongoDB } from "./data/mongoConfig/mongoConnection";
import {
  handleDeleteCart,
  handleGetCart,
  handlePutCart,
} from "./handlers/cartHandlers";
import {
  handleDeleteItem,
  handleGetItem,
  handlePostItem,
  handlePutItem,
} from "./handlers/itemHandlers";
import {
  handleDeleteOrder,
  handleGetOrder,
  handlePostOrder,
  handlePutOrder,
} from "./handlers/orderHandlers";
import {
  handleDeleteTable,
  handleGetTable,
  handlePostTable,
} from "./handlers/tableHandlers";
import {
  handleDeleteUser,
  handleGetValidate,
  handlePostLogin,
  handlePostSignup,
  handlePutUser,
} from "./handlers/userHandlers";
import { authMiddleware } from "./middlewares/auth/authMIddleware";
import { connectMongoDBMiddleware } from "./middlewares/mongo/mongoDBMiddleware";

configDotenv();
const app = express();

/* Middlewares */

app.use(express.json());
app.use(cookieParser());
// TODO: setup cors permission for the ui origin only
app.use(
  cors({
    origin: "*",
    methods: "OPTIONS, POST, PUT, GET",
    allowedHeaders: "Authorization, Content-type",
    maxAge: 86400, // 86400 seconds = 24 hours
    // credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(authMiddleware);
app.use(connectMongoDBMiddleware);

/* user endpoints */
app.get("/validate", handleGetValidate);
app.post("/login", handlePostLogin);
app.post("/signup", handlePostSignup);
app.put("/user", handlePutUser);
app.delete("/user", handleDeleteUser);

/* item endpoints */
app.get("/item", handleGetItem);
app.post("/item", handlePostItem);
app.put("/item", handlePutItem);
app.delete("/item", handleDeleteItem);

/* order endpoints */
app.get("/order", handleGetOrder);
app.post("/order", handlePostOrder);
app.put("/order", handlePutOrder);
app.delete("/order", handleDeleteOrder);

/* table endpoints */
app.get("/table", handleGetTable);
app.post("/table", handlePostTable);
app.delete("/table", handleDeleteTable);

/* cart endpoints */
app.get("/cart", handleGetCart);
app.put("/cart", handlePutCart);
app.delete("/cart", handleDeleteCart);

app.get("/", async (req, res) => {
  console.log("works");
  res.send("works");
});

app.use(disconnectFromMongoDB);

app.listen(PORT, () => {
  console.log(`Listening at ${PORT} port`);
});
