const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Item, CartItem, Table, Order } = require("./models");
const { JWT_KEY, SALT_ROUNDS_FOR_HASHING } = require("./constants");

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
    const { userName, userEmail, userPassword, userRole } = req.body;

    const hashedPassword = await bcrypt.hash(
      userPassword,
      SALT_ROUNDS_FOR_HASHING
    );
    const newUser = new User({
      userName: userName,
      userPassword: hashedPassword,
      userRole: userRole,
      userEmail: userEmail,
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
    const { userPassword, userEmail, userRole } = req.body;
    const user = await User.find({
      userEmail: userEmail,
      userRole: userRole.toLowerCase(),
    });
    if (!user) {
      res.json({
        success: false,
        message: "Incorrect username or password",
      });
      return;
    }
    const isCorrect = await bcrypt.compare(userPassword, user[0].userPassword);
    if (!isCorrect) {
      res.json({
        success: false,
        message: "Incorrect username or password",
      });
      return;
    }
    const userData = {
      userId: user[0].userId,
      userEmail: user[0].userEmail,
      userName: user[0].userName,
      userRole: user[0].userRole,
    };
    const authToken = await generateToken(userData, 1000 * 60 * 60 * 24 * 7); // 7 days
    console.log("token type", authToken);

    // TODO: DEPLOY AT SAME ORIGIN TO MAKE IT WORK... or maybe learn more :)
    // res.cookie("auth", authToken, {
    //   httpOnly: false, // Make the cookie accessible only via HTTP(S) and not JavaScript
    //   secure: false, // Send the cookie only over HTTPS
    //   sameSite: "strict", // Limit the cookie to same-site requests
    // });

    res.json({
      success: true,
      authToken: authToken,
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
  // const token = req.body.authToken;
  // try {
  res.json({
    success: true,
    userData: req.userData,
  });
  // } catch (err) {
  //   res.json({
  //     success: false,
  //   });
  // }
};

const handlePostCreateItem = async (req, res) => {
  try {
    const { itemName, category, timeToPrepare, ingredients, imageUrl } =
      req.body;
    const newItem = new Item({
      itemName: itemName,
      category: category,
      timeToMake: timeToPrepare,
      ingredients: ingredients,
      quantityLeft: 0,
      imageUrl: imageUrl,
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
    // const valid = await verifyToken(req.body.authToken);
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
    const { userEmail, itemId, quantity } = req.body;
    const user = await User.find({
      userEmail: userEmail,
    });
    if (user) {
      const deletion = await CartItem.deleteMany({
        itemId: itemId,
        userId: user[0].userId,
      });
      if (quantity === 0) {
        res.json({
          success: true,
          data: null,
        });
      } else {
        const newCartItem = new CartItem({
          itemId: itemId,
          userId: user[0].userId,
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
    const { userEmail, itemId } = req.body;
    const user = await User.find({
      userEmail: userEmail,
    });
    if (user.length) {
      const cartItem = await CartItem.find({
        userEmail: user.userId,
        itemId: itemId,
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
      userEmail: req.body.userEmail,
    });
    if (user.length) {
      const cartItemList = await CartItem.find({
        userId: user[0].userId,
      });
      const items = cartItemList.map(async (item) => {
        const target = await Item.find({
          itemId: item.itemId,
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
    const { userEmail } = req.body;
    const user = await User.find({
      userEmail: userEmail,
    });
    if (user) {
      if (user[0].tableNo) {
        const table = await Table.find({
          tableNo: user[0].tableNo,
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
    const { authToken, tableNo } = req.body;

    const userData = await verifyToken(authToken);

    const done = await User.updateOne(
      {
        userEmail: userData.userEmail,
      },
      {
        $set: {
          tableNo: tableNo,
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
    const { authToken, instructions, tableNo } = req.body;
    const userData = await verifyToken(authToken);
    const cartItems = await CartItem.find({
      userId: userData.userId,
    });
    const orders = cartItems.map((item) => {
      return {
        userId: item.userId,
        itemId: item.itemId,
        tableNo: tableNo,
        quantity: item.quantity,
        instructions: instructions,
        userName: userData.userName,
      };
    });
    orders.forEach(async (order) => {
      const newOrder = new Order(order);
      await newOrder.save();
    });
    await CartItem.deleteMany({
      userId: userData.userId,
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
    const userEmail = req.body.userEmail;
    const user = await User.find({
      userEmail: userEmail,
    });
    if (user) {
      let orders;
      if (user[0].userRole === "employee") {
        orders = await Order.find({
          userId: user[0].userId,
          status: "completed",
        });
      } else {
        orders = await Order.find({
          status: "completed",
        });
      }
      const dataPromises = orders.map(async (order) => {
        const item = await Item.find({ itemId: order.itemId });
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
    const { orderId, new_status } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: orderId },
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
    const userEmail = req.body.userEmail;
    const user = await User.find({
      userEmail: userEmail,
    });
    if (user) {
      let orders;
      if (user[0].userRole === "employee") {
        orders = await Order.find({
          userId: user[0].userId,
          status: "waiting",
        });
      } else {
        orders = await Order.find({
          status: "waiting",
        });
      }
      const dataPromises = orders.map(async (order) => {
        const item = await Item.find({ itemId: order.itemId });
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
    const userEmail = req.body.userEmail;
    const user = await User.find({
      userEmail: userEmail,
    });
    if (user) {
      let orders;
      if (user[0].userRole === "employee") {
        orders = await Order.find({
          userId: user[0].userId,
          status: "preparing",
        });
      } else {
        orders = await Order.find({
          status: "preparing",
        });
      }
      const dataPromises = orders.map(async (order) => {
        const item = await Item.find({ itemId: order.itemId });
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
