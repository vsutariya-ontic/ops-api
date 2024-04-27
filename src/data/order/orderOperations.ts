import { Order } from "../mongoConfig/mongoConnection";

/* Order */
const readOrderById = async (orderId) => {
  const order = await Order.find({
    orderId: orderId,
  });
  return order?.[0];
};

const readOrder = async (userId, status) => {
  const order = await Order.find({
    userId: userId,
    status: status,
  });
  // const items = order?.[0]?.items;
  return order;
};

const readAllOrders = async (userId) => {
  const order = await Order.find({
    userId: userId,
  });
  const items = order?.[0]?.items;
  return items;
};

// No need as upsert true will create a new order
const createOrder = async (propsOrder) => {
  const createdOrder = new Order(propsOrder);
  const successfullySavedOrder = await createdOrder.save();
  return successfullySavedOrder;
};

const updateOrder = async (propsOrder) => {
  // TODO: check if $set works with upsert...
  const successfullySavedOrder = await Order.findOneAndUpdate(
    {
      userId: propsOrder.userId,
      orderId: propsOrder.orderId,
    },
    {
      $set: {
        status: propsOrder.status,
      },
    },
    {
      new: true,
    }
  );
  return successfullySavedOrder;
};

export { createOrder, readAllOrders, readOrder, readOrderById, updateOrder };
