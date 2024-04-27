import {
  connectToMongoDB,
  disconnectFromMongoDB,
} from "../../data/mongoConfig/mongoConnection";
import { getResponseJson } from "../../utils/jsonUtils";

export const connectMongoDBMiddleware = async (request, response, next) => {
  try {
    await connectToMongoDB();
    next();
  } catch (err) {
    response.json(getResponseJson(err, false));
  }
};

export const disconnectMongoDBMiddleware = async (request, response, next) => {
  try {
    await disconnectFromMongoDB();
    next();
  } catch (err) {
    console.log("URGENT MONGO DB ERROR", err);
  }
};
