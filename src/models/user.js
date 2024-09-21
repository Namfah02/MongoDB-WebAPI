import { ObjectId } from "mongodb";
import { db } from "../database.js";

/**
 *  Create a new user model object
 *
 * @param {String | ObjectId | null} _id - mongoDB oject id for the user
 * @param {String} firstName - User firstName
 * @param {String} lastName - User lastName
 * @param {String} email - Email associated with the user account (used for login)
 * @param {String} password - Password associated with the user account (used for login)
 * @param {String} role - Access role for use by authorisation logic
 * @param {Date} createdDate - Date and time of create user
 * @param {Date} lastLoggedIn - Date and time of user's last login
 * @param {String} authenticationKey -  Key used to authenticate user requests
 * @returns {Object} - User model object
 */
export function User(
  _id,
  firstName,
  lastName,
  email,
  password,
  role,
  createdDate,
  lastLoggedIn,
  authenticationKey
) {
  return {
    _id: new ObjectId(_id),
    firstName,
    lastName,
    email,
    password,
    role,
    createdDate: new Date(createdDate) ,
    lastLoggedIn,
    authenticationKey,
  };
}

/**
 * Insert user into the database
 *
 * @export
 * @async
 * @param {Object} user - User to insert
 * @returns {Promise<InsertOneResult>} - The result of the insert operation
 */
export async function create(user) {
  // Clear _id from user to ensure the new user does not have an existing _id from the database, as we want a new _id to be created and added to the user object.
  delete user.id;

  // Insert the user document and implicitly add the new _id to user
  return db.collection("users").insertOne(user);
}

/**
 * Insert user with id into the database
 *
 * @export
 * @async
 * @param {ObjectId} id
 * @param {Object} user - User to insert
 * @returns {Promise<InsertOneResult>} - The result of the insert operation
 */
export async function createWithId(id, user) {
  // Clear _id from user to ensure the new user does not have an existing _id from the database, as we want a new _id to be created and added to the user object.
  delete user._id;

  const objectId = new ObjectId(id);
  // Insert the user document and implicitly add the new _id to user
  // return db.collection("users").insertOne(user);
  return db.collection("users").insertOne({ _id: objectId, ...user });
}

/**
 * Insert the provided users into the database (createMany)
 *
 * @export
 * @async
 * @param {Object[]} users - The users to insert
 * @returns {Promise<InsertManyResult>} - The result of the insert operation
 */
export async function createMany(users) {
  return db
    .collection("users")
    .insertMany(users)
    .then((result) => {
      for (const user of users) {
        user.id = user._id.toString()
        delete user._id
      }
      return Promise.resolve(users)
    })
}

/**
 * Get all users
 *
 * @export
 * @async
 * @returns {Promise<Object[]>} - A promise for the array of all user objects
 */
export async function getAll() {
  return db.collection("users").find().toArray();
}

/**
 * Get user by ObjectId
 *
 * @export
 * @async
 * @param {ObjectId} id - mongoDB user ObjectId
 * @returns {Promise<Object>} - A promise for the matching user
 */
export async function getById(id) {
  // attempt to find the first matching user by user id
  let user = await db.collection("users").findOne({ _id: new ObjectId(id) });

  // check if a user was found and provide the result
  if (user) {
    return user;
  } else {
    return Promise.reject("user not found");
  }
}

/**
 * Get a user by email address
 *
 * @export
 * @async
 * @param {ObjectId} email - Email address of the user
 * @returns {Promise<Object>} - A promise for the matching user
 */
export async function getByEmail(email) {
  // attempt to find the first matching user by email
  let user = await db.collection("users").findOne({ email: email })

  // check if a user was found and handle the result
  if (user) {
      return user
  } else {
      return null
  }
}

/**
 * Get user by authentication key
 *
 * @export
 * @async
 * @param {ObjectId} key - Authentication key
 * @returns {Promise<Object>} - A promise for the matching user
 */
export async function getByAuthenticationKey(key) {
  // Attempt to find the first matching user by authentication key
  let user = await db.collection("users").findOne({ authenticationKey: key });

  // Check if a user was found and handle the result
  if (user) {
    return user;
  } else {
    return Promise.reject("user not found");
  }
}

/**
 * Update user in the database
 *
 * @export
 * @async
 * @param {Object} user - user to update
 * @returns {Promise<UpdateResult>} - The result of the update operation
 */
export async function update(user) {
  // update the user by replacing the user by id
  // Copy user and delete ID from this
  const userWithoutId = { ...user };
  delete userWithoutId._id;

  return db
    .collection("users")
    .replaceOne({ _id: new ObjectId(user._id) }, userWithoutId);
    
}

/**
 * Update many users in the database
 *
 * @export
 * @async
 * @param {Object[]} users - Readings to update
 * @returns {Promise<UpdateResult>} - The result of the update operation
 */
export async function updateMany(users) {
  const updateUsers = users.map((user) => {
    const userWithoutId = { ...user }
    const id = user._id
    delete userWithoutId._id
    return {
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: userWithoutId },
      },
    }
  })
  return db.collection("users").bulkWrite(updateUsers)
}

/**
 * Delete user by ObjectId
 *
 * @export
 * @async
 * @param {ObjectId} id - mongoDB ObjectId user delete
 * @returns {Promise<DeleteResult>} - The result of the delete operation
 */
export async function deleteById(id) {
  return db.collection("users").deleteOne({ _id: new ObjectId(id) });
}

/**
 * Delete many users by ObjectId
 *
 * @param {ObjectId[]} userIds - mongoDB ObjectId users
 * @returns {Promise<DeleteManyResult>} - The result of the delete operation
 */
export async function deleteManyByIds(userIds) {
  return db.collection("users").deleteMany({
    _id: { $in: userIds.map((id) => new ObjectId(id)) },
  })
}

/**
 * Update Many access control by date range
 *
 * @param {String} startDate - The start date
 * @param {String} endDate - The end date
 * @param {String} role - Role of users
 * @returns {Promise<UpdateResult>} - The result of the update operation
 */
export async function updateRolesByCreatedDateRange(startDate, endDate, role) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const result = await db
    .collection("users")
    .updateMany(
      { createdDate: { $gte: start, $lte: end } },
      { $set: { "role": role } }
    );

  if (result) {
    return result;
  } else {
    return Promise.reject("Failed to update user roles");
  }
}

/**
 * Delete many users (students) last logged between two dates
 * 
 * @param {String} startDate - The start date for last loggedin
 * @param {String} endDate - The start date for last loggedin
 * @param {String} userRole - The role of the users to delete
 * @returns {Promise<DeleteResult>} - The result of the delete operation
 */
export async function deleteManyByLastLoggedInDateRange(startDate, endDate, userRole) {

  const start = new Date(startDate)
  const end = new Date(endDate)

  return db
    .collection("users")
    .deleteMany({
      "role": userRole,
      lastLoggedIn: { $gte: start, $lte: end }
   })
}
