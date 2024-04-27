import { updateCart } from "../data/cart/cartOperations";
import {
  createOrder,
  readAllOrders,
  readOrder,
  updateOrder,
} from "../data/order/orderOperations";
import { getResponseJson } from "../utils/jsonUtils";

const handleGetOrder = async (request, response) => {
  try {
    const { status } = request.query;
    const { userId } = request.userData;
    const order = status
      ? await readOrder(userId, status)
      : await readAllOrders(userId);
    response.json(getResponseJson(order));
  } catch (err) {
    response.json(getResponseJson(err?.message || "INTERNAL_ERROR", false));
  }
};

const handlePostOrder = async (request, response) => {
  try {
    const successfullySavedOrder = await createOrder({
      ...request.body,
      userId: request.userData.userId,
    });
    const successfullyDeletedCart = await updateCart({
      userId: request.userData.userId,
      isDeleted: true,
    });
    response.json(getResponseJson(successfullySavedOrder));
  } catch (err) {
    response.json(getResponseJson(err?.message, false));
  }
};

const handlePutOrder = async (request, response) => {
  try {
    const successfullySavedOrder = await updateOrder({
      ...request.body,
      userId: request.userData.userId,
    });
    response.json(getResponseJson(successfullySavedOrder));
  } catch (err) {
    response.json(getResponseJson(err?.message, false));
  }
};

const handleDeleteOrder = async (request, response) => {};

export { handleDeleteOrder, handleGetOrder, handlePostOrder, handlePutOrder };
