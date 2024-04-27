import mongoose from "mongoose";
import { Cart } from "../mongoConfig/mongoConnection";

/* Cart */
const readCart = async (userId, isDeleted = false) => {
  const cart = await Cart.find({
    userId: userId,
    isDeleted: isDeleted,
  });
  // const items = cart?.[0]?.items;
  return cart?.[0];
};

const updateCart = async (propsCart) => {
  // TODO: check if $set works with upsert...
  const successfullySavedCart = await Cart.findOneAndUpdate(
    {
      userId: propsCart.userId,
      cartId: propsCart.cartId || undefined,
      isDeleted: false,
    },
    {
      $set: {
        items: propsCart.items,
      },
      $setOnInsert: {
        cartId: String(new mongoose.Types.ObjectId()),
        userId: propsCart.userId,
        isDeleted: false,
      },
    },
    {
      new: true,
      upsert: Boolean(!propsCart.cartId),
    }
  );
  console.log(successfullySavedCart);
  return successfullySavedCart;
};

const deleteCart = async (userId: string) => {
  const successfullyDeletedCart = await Cart.findOneAndUpdate(
    {
      userId: userId,
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
      },
    },
    {
      new: true,
    }
  );
  return successfullyDeletedCart;
};

export { deleteCart, readCart, updateCart };
