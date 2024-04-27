import { Cart } from "../mongoConfig/mongoConnection";

/* Cart */
const readCart = async (userId, isDeleted = false) => {
  const cart = await Cart.find({
    userId: userId,
    isDeleted: isDeleted,
  });
  const items = cart?.[0]?.items;
  return items;
};

const updateCart = async (propsCart) => {
  // TODO: check if $set works with upsert...
  const successfullySavedCart = await Cart.findOneAndUpdate(
    {
      userId: propsCart.userId,
      cartId: propsCart.cartId || undefined,
      status: propsCart.status,
      isDeleted: false,
    },
    {
      $set: {
        ...propsCart,
      },
    },
    {
      new: true,
      upsert: Boolean(!propsCart.cartId),
    }
  );
  return successfullySavedCart;
};

export { readCart, updateCart };
