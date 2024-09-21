import * as Users from "../models/user.js";
import { v4 as uuid4 } from "uuid";
import bcrypt from "bcryptjs";

/**
 * POST /auth/login
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function loginUser(req, res) {
  // Access the login data in the request
  const loginData = req.body;

  // Find user email
  const user = await Users.getByEmail(loginData.email);
  if (user) {
    // Check the password match
    if (bcrypt.compareSync(loginData.password, user.password)) {
      // Generate new API key
      user.authenticationKey = uuid4().toString();

      // Update the user record with the new api key
      const authenticatedUser = await Users.update(user);

      // Update last login date to current date and time
      user.lastLoggedIn = new Date()
      const lastLoggedInUser = await Users.update(user)

      res.status(200).json({
        status: 200,
        message: "user logged in successful",
        authenticationKey: user.authenticationKey,
      });
    } else {
      // Error for invalid password
      res.status(401).json({
        status: 401,
        message: "Invalid credentials",
      });
    }
  } else {
    // Error for user not found
    res.status(401).json({
      status: 401,
      message: "Invalid credentials",
    });
  }
}

/**
 * POST /auth/logout
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function logoutUser(req, res) {
  const authenticationKey = req.body.authenticationKey;

  try {
    const userToLogout = await Users.getByAuthenticationKey(authenticationKey);

    userToLogout.authenticationKey = null;

    await Users.update(userToLogout);

    res.status(200).json({
      status: 200,
      message: "user logged out",
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "failed to find user",
    });
  }
}

/**
 * POST /auth/register
 * 
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @returns 
 */
export async function registerUser(req, res) {
  // Access the login data in the request
  const userData = req.body;

  const userAlreadyUsed = await Users.getByEmail(userData.email)
  // Check if email already used with other account
  if (userAlreadyUsed) {
    res.status(409).json({
      status: 409,
      message: "Email address is already used with other account.",
    })
    return
  }

  // Hash the password
  userData.password = bcrypt.hashSync(userData.password);

  // Convert the user data into an User model object
  const user = Users.User(
    null,
    userData.firstName,
    userData.lastName,
    userData.email,
    userData.password,
    "student",
    new Date(),
    null,
    null
  );

  // Use the create model function to insert the user into the database
  Users.create(user).then((user) => {
      res.status(200).json({
        status: 200,
        message: "Registration successful",
        user: user,
      });
    }).catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Registration failed",
      });
    });
}
