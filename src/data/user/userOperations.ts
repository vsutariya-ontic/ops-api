/* User */

import { User } from "../mongoConfig/mongoConnection";

const readUserById = async (userId: string) => {
  const user = await User.find({
    userId: userId,
  });
  console.log(user, userId, "crud");
  return user?.[0];
};
const readUser = async (userEmail: string, userRole: string) => {
  const user = await User.find({
    userEmail: userEmail,
    userRole: userRole.toLowerCase(),
  });
  console.log(user?.[0], "data");
  return user?.[0];
};
const createUser = async (propsUser) => {
  const createdUser = new User(propsUser);
  const successfullySavedUser = await createdUser.save();
  return successfullySavedUser;
};
const updateUser = async (newFields, userId) => {
  const successfullySavedUser = await User.findOneAndUpdate(
    {
      userId: userId,
    },
    {
      $set: {
        ...newFields,
      },
    },
    {
      new: true,
    }
  );
  return successfullySavedUser;
};

export { createUser, readUser, readUserById, updateUser };
