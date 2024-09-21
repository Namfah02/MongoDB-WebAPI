import * as Users from "../models/user.js";
import bcrypt from "bcryptjs";

/**
 * GET/users/
 *
 * @param {Request} req -  Request object
 * @param {Response} res -  Response object
 */
export async function getAllUsers(req, res) {
  const users = await Users.getAll();

  const authenticationKey = req.get("X-AUTH-KEY");
  const currentUser = await Users.getByAuthenticationKey(authenticationKey);

  if (currentUser.role !== "admin" && currentUser.role !== "teacher") {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to access user information.",
    });
    return;
  }

  // Convert _id to string for each user
  users.forEach((user) => {
    user._id = user._id.toString();
  });

  Users.getAll()
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "Get all users successfully",
        user: user,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: 500,
        error: error,
      });
    });
}

/**
 * GET/users/:id
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function getUserById(req, res) {
  const userId = req.params.id;

  const authenticationKey = req.get("X-AUTH-KEY");
  const currentUser = await Users.getByAuthenticationKey(authenticationKey);

  if (currentUser.role !== "admin" && currentUser.role !== "teacher") {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to access user information.",
    });
    return;
  }

  //MongoDB object ID validation
  const idFormat = /^[0-9a-fA-F]{24}$/;
  if (!idFormat.test(userId)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid ID format",
    });
  }

  Users.getById(userId)
    .then((user) => {
      if (user && user._id) {
        user._id = user._id.toString(); // Convert ObjectId to string
      }
      res.status(200).json({
        status: 200,
        message: "Get user by ID successfully",
        user: user,
      });
    })
    .catch((error) => {
      if (error === "user not found") {
        return res.status(404).json({
          status: 404,
          message: "User not found with ID: " + userId,
        });
      }
      res.status(500).json({
        status: 500,
        message: "Failed to get user by ID",
      });
    });
}

/**
 * GET /users/key/:authenticationKey
 *
 * @param {Request} req The Request object
 * @param {Response} res The Response object
 */
export function getUserByAuthenticationKey(req, res) {
  const authenticationKey = req.params.authenticationKey;

  Users.getByAuthenticationKey(authenticationKey)
    .then((user) => {
      if (user && user._id) {
        user._id = user._id.toString(); // Convert ObjectId to string
      }
      res.status(200).json({
        status: 200,
        message: "Get user by authentication key",
        user: user,
      });
    })
    .catch((error) => {
      if (error === "user not found") {
        return res.status(404).json({
          status: 404,
          message:
            "User not found with authentication key: " + authenticationKey,
        });
      }
      res.status(500).json({
        status: 500,
        message: "Failed to get user by authentication key",
      });
    });
}

/**
 * POST /users/
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function createUser(req, res) {
  // Access user data in body of request
  const userData = req.body;

  const authenticationKey = req.get("X-AUTH-KEY");
  const currentUser = await Users.getByAuthenticationKey(authenticationKey);

  if (currentUser.role !== "admin" && currentUser.role !== "teacher") {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to access user information.",
    });
    return;
  }

  // Check if email already exists
  const userAlreadyExists = await Users.getByEmail(userData.email);
  if (userAlreadyExists) {
    res.status(409).json({
      status: 409,
      message: "The provided email address is already in use",
    });
    return;
  }

  // Hash the password (if not already hashed)
  if (userData && userData.password && !userData.password.startsWith("$2a")) {
    userData.password = bcrypt.hashSync(userData.password);
  }

  // Create a user model from the user data
  const user = Users.User(
    null,
    userData.firstName,
    userData.lastName,
    userData.email,
    userData.password,
    userData.role,
    new Date().toISOString(),
    null,
    null
  );

  Users.create(user).then((user) => {
    res.status(200).json({
      status: 200,
      message: "User created successfully",
      user: user,
    })
  }).catch((error) => {
    return res.status(500).json({
      status: 500,
      error: error,
    })
  })
}

/**
 * PUT /users/:id
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function createUserWithId(req, res) {
  const userData = req.body;
  const { id } = req.params;

  const authenticationKey = req.get("X-AUTH-KEY");
  const currentUser = await Users.getByAuthenticationKey(authenticationKey);

  if (currentUser.role !== "admin" && currentUser.role !== "teacher") {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to access user information.",
    });
    return;
  }

  const idFormat = /^[0-9a-fA-F]{24}$/;
  if (!idFormat.test(id)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid ID format",
    });
  }

  // Check if email already exists
  const userAlreadyExists = await Users.getByEmail(userData.email);
  if (userAlreadyExists) {
    res.status(409).json({
      status: 409,
      message: "The provided email address is already in use",
    });
    return;
  }

  // Hash the password (if not already hashed)
  if (userData && userData.password && !userData.password.startsWith("$2a")) {
    userData.password = bcrypt.hashSync(userData.password);
  }

  // Create a user model from the user data
  const user = Users.User(
    userData._id,
    userData.firstName,
    userData.lastName,
    userData.email,
    userData.password,
    userData.role,
    new Date().toISOString(),
    null,
    null
  );

  Users.createWithId(id, user).then((user) => {
    res.status(200).json({
      status: 200,
      message: "User created with id successfully",
      user: user,
    });
  });
}

/**
 * POST /users/many
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function createMany(req, res) {
  // Access user data in body of request
  const usersData = req.body;

  const authenticationKey = req.get("X-AUTH-KEY");
  const currentUser = await Users.getByAuthenticationKey(authenticationKey);

  if (currentUser.role !== "admin" && currentUser.role !== "teacher") {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to access user information.",
    });
    return;
  }

  // Create an array to store user models
  const users = [];

  for (const userData of usersData) {
    const { _id, ...userWithoutId } = userData;

    // Check if email already exists
    const userAlreadyExists = await Users.getByEmail(userData.email);
    if (userAlreadyExists) {
      return res.status(409).json({
        status: 409,
        message: "The provided email address is already in use",
      });
    }

    // Hash the password (if not already hashed)
    if (!userData.password.startsWith("$2a")) {
      userData.password = bcrypt.hashSync(userData.password);
    }

    // Create a user model and push it to the users array
    const user = Users.User(
      null,
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.password,
      userData.role,
      new Date().toISOString(),
      null,
      null
    );
    users.push(user);
  }

  // Create users in to the database
  const userCreated = await Users.createMany(users);
  return res.status(200).json({
    status: 200,
    message: `Created ${userCreated.length} users successfully`,
    user: userCreated,
  });
}

/**
 * PATCH /users/
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function updateUserById(req, res) {
  // Get the user data out of the request
  const userData = req.body;

  const authenticationKey = req.get("X-AUTH-KEY");
  const currentUser = await Users.getByAuthenticationKey(authenticationKey);

  if (currentUser.role !== "admin" && currentUser.role !== "teacher") {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to access user information.",
    });
    return;
  }

  // Retrieve the existing user from the database to keep create date and last loggedin date
  Users.getById(userData._id)
    .then((existingUser) => {
      if (!existingUser) {
        return res.status(404).json({
          status: 404,
          message: "User not found with ID: " + userData._id,
        });
      }

      if (!userData.createdDate) {
        userData.createdDate = existingUser.createdDate;
      }
      if (!userData.lastLoggedIn) {
        userData.lastLoggedIn = existingUser.lastLoggedIn;
      }

      // hash the password if it is not already hashed
      if (!userData.password.startsWith("$2a")) {
        userData.password = bcrypt.hashSync(userData.password);
      }

      // Convert the user data into a User model object
      const updatedUser = Users.User(
        userData._id,
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
        userData.role,
        userData.createdDate,
        userData.lastLoggedIn,
        userData.authenticationKey
      );

      // Use the update model function to update this user in the database
      return Users.update(updatedUser);
    })
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "User updated successfully",
        user: user,
      });
    })
    .catch((error) => {
      if (error === "user not found") {
        return res.status(404).json({
          status: 404,
          message: "User not found with given ID",
        });
      }
      res.status(500).json({
        status: 500,
        message: "Failed to update user",
      });
    });
}

/**
 * PATCH /users/many
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function updateManyUser(req, res) {
  // Get the user data out of the request
  const userData = req.body;

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)

  if (currentUser.role !== "admin" && currentUser.role !== "teacher") {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to access user information.",
    })
    return
  }

  // Retrieve and update each user
  const updatedUsersPromise = Promise.all(
    userData.map(async (userData) => {
      // Retrieve the existing user to keep create date and last loggedin date
      const existingUser = await Users.getById(userData._id);

      // Keep the last login and date created
      userData.createdDate = existingUser.createdDate;
      userData.lastLoggedIn = existingUser.lastLoggedIn;

      // Hash the password if it is not already hashed
      if (userData.password && !userData.password.startsWith("$2a")) {
        userData.password = bcrypt.hashSync(userData.password);
      }

      // Convert the user data into a User model object
      return Users.User(
        userData._id,
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
        userData.role,
        userData.createdDate,
        userData.lastLoggedIn,
        userData.authenticationKey
      );
    })
  );

  // Handle the result of updating users
  updatedUsersPromise.then((updatedUsers) => {
      // Use the updateMany function to update all users in the database
      return Users.updateMany(updatedUsers);
    })
    .then((result) => {
      if (result.modifiedCount === 0) {
        // Handle the case where no documents were updated
        res.status(404).json({
          status: 404,
          message: "No users were updated",
        });
      } else {
        // Return success message with the count of updated users
        res.status(200).json({
          status: 200,
          message: `${result.modifiedCount} users updated successfully`,
        });
      }
    })
    .catch((error) => {
      if (error === "user not found") {
        return res.status(404).json({
          status: 404,
          message: "Users not found with given ID",
        });
      }
      res.status(500).json({
        status: 500,
        message: "Failed to update multiple users",
      });
    });
}

/**
 * DELETE /users/:id
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function deleteUserById(req, res) {
  const userID = req.params.id;

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)

  if (currentUser.role !== "admin" && currentUser.role !== "teacher") {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to access user information.",
    })
    return
  }

  //MongoDB object ID validation
  const idFormat = /^[0-9a-fA-F]{24}$/;
  if (!idFormat.test(userID)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid ID format",
    });
  }

  Users.deleteById(userID)
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({
          status: 200,
          message: "User deleted successfully",
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "User ID not found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to delete user",
      });
    });
}

/**
 * DELETE/users/delete/many
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function deleteManyByIds(req, res) {
  const userIds = req.body.ids;

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)

  if (currentUser.role !== "admin" && currentUser.role !== "teacher") {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to access user information.",
    })
    return
  }

  //MongoDB object ID validation
  const idFormat = /^[0-9a-fA-F]{24}$/;
  for (const id of userIds) {
    if (!idFormat.test(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid ID format",
      });
    }
  }

  Users.deleteManyByIds(userIds)
    .then((result) => {
      if (result.deletedCount === 0) {
        res.status(404).json({
          status: 404,
          message: "Users not found to delete",
        });
        return;
      }

      res.status(200).json({
        status: 200,
        message: `${result.deletedCount} users deleted successfully`,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to delete users",
      });
    });
}

/**
 * PATCH/update/usersrole
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function updateRolesByDateRange(req, res) {
  // Get the user data out of the request
  const { startDate, endDate, role } = req.body;

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)

  if (currentUser.role !== "admin") {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to access user information.",
    })
    return
  }

  // Use the update model function to update this user in the Database
  try {
    const result = await Users.updateRolesByCreatedDateRange(
      startDate,
      endDate,
      role
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: "Users not found to update roles",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Updated the roles of users by date range successfully",
      result: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed to update the roles of users",
    });
  }
}

/**
 * DELETE/users/deleterolesbydaterange
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function deleteRolesByDateRange(req, res) {
  const { startDate, endDate, userRole } = req.body;

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)

  if (currentUser.role !== "admin") {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to access user information.",
    })
    // Return to stop running this function here
    return
  }

  Users.deleteManyByLastLoggedInDateRange(startDate, endDate, userRole)
    .then((result) => {
      if (result.deletedCount > 0) {
        return res.status(200).json({
          status: 200,
          message: `Deleted ${result.deletedCount} users with student role and last logged in between ${startDate} and ${endDate} successfully`,
        });
      } else {
        return res.status(404).json({
          status: 404,
          message: `No users found with student role and last logged in between ${startDate} and ${endDate}`,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to delete users",
      });
    });
}
