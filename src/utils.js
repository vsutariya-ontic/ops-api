const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Item, CartItem, Table, Order } = require("./models");

const JWT_KEY = "special-key";
const SALT_ROUNDS_FOR_PASSWORD = 10;

const generateToken = (userData, validity) => {
  return new Promise((resolve, reject) => {
    jwt.sign(userData, JWT_KEY, { expiresIn: validity }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_KEY, (err, valid) => {
      if (err) {
        reject(err);
      } else {
        resolve(valid);
      }
    });
  });
};

const handlePostSignup = async (req, res) => {
  try {
    const { user_name, user_email, user_password, user_role } = req.body;

    const hashedPassword = await bcrypt.hash(
      user_password,
      SALT_ROUNDS_FOR_PASSWORD
    );
    const newUser = new User({
      user_name: user_name,
      user_password: hashedPassword,
      user_role: user_role,
      user_email: user_email,
    });
    const response = await newUser.save();

    res.json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      error: err,
    });
  }
};
const handlePostLogin = async (req, res) => {
  // Validate username and password...
  try {
    console.log(req.body);
    const { user_password, user_email, user_role } = req.body;
    const user = await User.find({
      user_email: user_email,
      user_role: user_role.toLowerCase(),
    });
    if (!user) {
      res.json({
        success: false,
        message: "Incorrect username or password",
      });
      return;
    }
    const isCorrect = await bcrypt.compare(
      user_password,
      user[0].user_password
    );
    if (!isCorrect) {
      res.json({
        success: false,
        message: "Incorrect username or password",
      });
      return;
    }
    const userData = {
      user_id: user[0].user_id,
      user_email: user[0].user_email,
      user_name: user[0].user_name,
      user_role: user[0].user_role,
    };
    const authToken = await generateToken(userData, 1000 * 60 * 24 * 7); // 7 days

    res.json({
      success: true,
      auth_token: authToken,
      message: "User logged in successfully",
      userData: userData,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err,
    });
  }
};

const handlePostValidate = async (req, res) => {
  const token = req.body.auth_token;
  try {
    const data = await verifyToken(token);
    res.json({
      success: true,
      userData: data,
    });
  } catch (err) {
    res.json({
      success: false,
    });
  }
};

const handlePostCreateItem = async (req, res) => {
  try {
    const { itemName, category, timeToPrepare, ingredients, imageUrl } =
      req.body;
    const newItem = new Item({
      item_name: itemName,
      category: category,
      time_to_make: timeToPrepare,
      ingredients: ingredients,
      quantity_left: 0,
      image_url: imageUrl,
    });
    const successfullySaved = await newItem.save();
    res.json({
      success: true,
      item: successfullySaved,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err,
    });
  }
};
const handlePostGetItem = async (req, res) => {
  try {
    // const valid = await verifyToken(req.body.auth_token);
    const query = req.query;
    if (!query) {
      const itemList = await Item.find();
      res.json({
        success: true,
        items: itemList,
      });
    } else {
      const itemListByQuery = await Item.find(query);
      res.json({
        success: true,
        items: itemListByQuery,
      });
    }
  } catch (err) {
    res.json({
      success: false,
      error: err,
    });
  }
};
const handleUploadCartItem = async (req, res) => {
  try {
    const { user_email, item_id, quantity } = req.body;
    const user = await User.find({
      user_email: user_email,
    });
    if (user) {
      const deletion = await CartItem.deleteMany({
        item_id: item_id,
        user_id: user[0].user_id,
      });
      if (quantity === 0) {
        res.json({
          success: true,
          data: null,
        });
      } else {
        const newCartItem = new CartItem({
          item_id: item_id,
          user_id: user[0].user_id,
          quantity: quantity,
        });
        const successfullySaved = await newCartItem.save();
        res.json({
          success: true,
          data: {
            cartItem: successfullySaved,
          },
        });
      }
    } else {
      res.json({
        succes: false,
        message: "No user found",
      });
    }
  } catch (err) {
    res.json({
      success: false,
      error: err,
    });
  }
};
const handlePostGetCartItemQuantity = async (req, res) => {
  try {
    const { user_email, item_id } = req.body;
    const user = await User.find({
      user_email: user_email,
    });
    if (user.length) {
      const cartItem = await CartItem.find({
        user_email: user.user_id,
        item_id: item_id,
      });
      if (cartItem.length) {
        res.json({
          success: true,
          quantity: cartItem[0].quantity,
        });
      } else {
        res.json({
          success: false,
          message: "CartItem not found",
        });
      }
    } else {
      res.json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      error: err,
    });
  }
};

const handlePostGetCartItemList = async (req, res) => {
  try {
    const user = await User.find({
      user_email: req.body.user_email,
    });
    if (user.length) {
      const cartItemList = await CartItem.find({
        user_id: user[0].user_id,
      });
      const items = cartItemList.map(async (item) => {
        const target = await Item.find({
          item_id: item.item_id,
        });
        return target[0];
      });
      const resolvedItems = await Promise.all(items);
      res.json({
        success: true,
        cartItems: cartItemList,
        items: resolvedItems,
      });
    } else {
      res.json({
        success: false,
        message: "User not found!",
      });
    }
  } catch (err) {
    res.json({
      success: false,
      error: err,
    });
  }
};
const handlePostGetTableList = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json({
      success: true,
      tables: tables,
    });
  } catch (err) {
    res.json({
      success: true,
      error: err,
    });
  }
};

const handlePostGetDefaultTable = async (req, res) => {
  try {
    const { user_email } = req.body;
    const user = await User.find({
      user_email: user_email,
    });
    if (user) {
      if (user[0].table_no) {
        const table = await Table.find({
          table_no: user[0].table_no,
        });
        res.json({
          success: true,
          table: table[0],
        });
      } else {
        res.json({
          success: false,
          message: "No default table",
        });
      }
    } else {
      res.json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    res.json({
      success: false,
      error: err,
    });
  }
};

const handlePostSetDefaultTable = async (req, res) => {
  try {
    const { auth_token, table_no } = req.body;

    const userData = await verifyToken(auth_token);

    const done = await User.updateOne(
      {
        user_email: userData.user_email,
      },
      {
        $set: {
          table_no: table_no,
        },
      }
    );
    if (done) {
      res.json({
        success: true,
        message: "Table added successfully",
      });
    } else {
      res.json({
        success: false,
        message: "Table not added",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      error: err,
    });
  }
};

const handlePlaceOrder = async (req, res) => {
  try {
    const { auth_token, instructions, table_no } = req.body;
    const userData = await verifyToken(auth_token);
    const cartItems = await CartItem.find({
      user_id: userData.user_id,
    });
    const orders = cartItems.map((item) => {
      return {
        user_id: item.user_id,
        item_id: item.item_id,
        table_no: table_no,
        quantity: item.quantity,
        instructions: instructions,
        user_name: userData.user_name,
      };
    });
    orders.forEach(async (order) => {
      const newOrder = new Order(order);
      await newOrder.save();
    });
    await CartItem.deleteMany({
      user_id: userData.user_id,
    });
    console.log("success");
    res.json({
      success: true,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err,
    });
  }
};

const handlePostGetOrders = async (req, res) => {
  try {
    const user_email = req.body.user_email;
    const user = await User.find({
      user_email: user_email,
    });
    if (user) {
      let orders;
      if (user[0].user_role === "employee") {
        orders = await Order.find({
          user_id: user[0].user_id,
          status: "completed",
        });
      } else {
        orders = await Order.find({
          status: "completed",
        });
      }
      const dataPromises = orders.map(async (order) => {
        const item = await Item.find({ item_id: order.item_id });
        return {
          order: order,
          item: item[0],
        };
      });
      const data = await Promise.all(dataPromises);
      res.json({
        success: true,
        data: data,
      });
    } else {
      res.json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    res.json({
      success: false,
      error: err,
    });
  }
};

const handlePostUpdateOrderStatus = async (req, res) => {
  try {
    const { order_id, new_status } = req.body;
    const order = await Order.findOneAndUpdate(
      { order_id: order_id },
      { $set: { status: new_status } },
      { new: true }
    );

    res.json({
      success: true,
      order: order,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err,
    });
  }
};

const handlePostGetPendingOrders = async (req, res) => {
  try {
    const user_email = req.body.user_email;
    const user = await User.find({
      user_email: user_email,
    });
    if (user) {
      let orders;
      if (user[0].user_role === "employee") {
        orders = await Order.find({
          user_id: user[0].user_id,
          status: "waiting",
        });
      } else {
        orders = await Order.find({
          status: "waiting",
        });
      }
      const dataPromises = orders.map(async (order) => {
        const item = await Item.find({ item_id: order.item_id });
        return {
          order: order,
          item: item[0],
        };
      });
      const data = await Promise.all(dataPromises);
      res.json({
        success: true,
        data: data,
      });
    } else {
      res.json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    res.json({
      success: false,
      error: err,
    });
  }
};

const handlePostGetPreparingOrders = async (req, res) => {
  try {
    const user_email = req.body.user_email;
    const user = await User.find({
      user_email: user_email,
    });
    if (user) {
      let orders;
      if (user[0].user_role === "employee") {
        orders = await Order.find({
          user_id: user[0].user_id,
          status: "preparing",
        });
      } else {
        orders = await Order.find({
          status: "preparing",
        });
      }
      const dataPromises = orders.map(async (order) => {
        const item = await Item.find({ item_id: order.item_id });
        return {
          order: order,
          item: item[0],
        };
      });
      const data = await Promise.all(dataPromises);
      res.json({
        success: true,
        data: data,
      });
    } else {
      res.json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    res.json({
      success: false,
      error: err,
    });
  }
};

module.exports = {
  handlePostLogin,
  verifyToken,
  generateToken,
  handlePostSignup,
  handlePostValidate,
  handlePostCreateItem,
  handlePostGetItem,
  handleUploadCartItem,
  handlePostGetCartItemQuantity,
  handlePostGetCartItemList,
  handlePostGetTableList,
  handlePostGetDefaultTable,
  handlePostSetDefaultTable,
  handlePlaceOrder,
  handlePostGetOrders,
  handlePostGetPendingOrders,
  handlePostUpdateOrderStatus,
  handlePostGetPreparingOrders,
};
