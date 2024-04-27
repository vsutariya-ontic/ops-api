import {
  createItem,
  readAllItems,
  readItem,
} from "../data/item/itemOperations";
import { getResponseJson } from "../utils/jsonUtils";

/* item api call handlers */
const handleGetItem = async (request, response) => {
  try {
    const itemId = request.query?.itemId;
    if (!itemId) {
      const items = await readAllItems(request.query);
      response.json(getResponseJson(items));
    } else {
      const item = await readItem(itemId);
      if (item) {
        response.json(getResponseJson(item));
      } else response.json(getResponseJson());
    }
  } catch (err) {
    response.json(getResponseJson(err?.message || "INTERNAL_ERROR", false));
  }
};

const handlePostItem = async (request, response) => {
  try {
    const successfullySavedItem = await createItem({
      ...request.body,
      createdBy: request.userData.userId,
    });
    response.json(getResponseJson(successfullySavedItem));
  } catch (err) {
    response.json(
      getResponseJson(err?.message || "ITEM_CREATION_FAILED", false)
    );
  }
};

const handleDeleteItem = async (request, response) => {};
const handlePutItem = async (request, response) => {};

export { handleDeleteItem, handleGetItem, handlePostItem, handlePutItem };
