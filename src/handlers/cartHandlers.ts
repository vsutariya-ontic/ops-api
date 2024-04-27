import { readCart, updateCart } from "../data/cart/cartOperations";
import { getResponseJson } from "../utils/jsonUtils";

const handleGetCart = async (request, response) => {
  try {
    const { userId } = request.userData;
    const cart = await readCart(userId);
    response.json(getResponseJson(cart));
  } catch (err) {
    response.json(getResponseJson(err?.message || "INTERNAL_ERROR", false));
  }
};

// const handlePostCart = async (request, response) => {};

const handlePutCart = async (request, response) => {
  try {
    const successfullySavedCart = await updateCart({
      ...request.body,
      userId: request.userData.userId,
    });
    response.json(getResponseJson(successfullySavedCart));
  } catch (err) {
    response.json(getResponseJson(err?.message, false));
  }
};
const handleDeleteCart = async (request, response) => {};

export { handleDeleteCart, handleGetCart, handlePutCart };
