/* Menu */

import { Item } from "../mongoConfig/mongoConnection";

const readItem = async (itemId) => {
  const item = await Item.find({
    itemId: itemId,
  });
  return item[0];
};

const readAllItems = async (query) => {
  const items = await Item.find(query);
  console.log(items);
  return items;
};

const createItem = async (props) => {
  const {
    itemName,
    category,
    quantityLeft,
    timeToMake,
    ingredients,
    imageUrl,
  } = props;

  const item = new Item({
    itemName: itemName,
    category: category,
    quantityLeft: quantityLeft,
    timeToMake: timeToMake,
    ingredients: ingredients,
    imageUrl: imageUrl,
  });

  const successfullySavedItem = await item.save();
  return successfullySavedItem;
};

const deleteItem = async (itemId) => {
  const deletedItems = await Item.deleteMany({ itemId: itemId });
  return deletedItems;
};

export { createItem, deleteItem, readAllItems, readItem };
