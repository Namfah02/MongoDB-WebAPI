import { Router } from "express";
import auth from"../middleware/auth.js"
import { createUser,createUserWithId, createMany, deleteRolesByDateRange, deleteUserById, deleteManyByIds, getAllUsers, getUserByAuthenticationKey, getUserById, updateRolesByDateRange, updateUserById, updateManyUser } from "../controllers/users.js";


const userRouter = Router()

/**
 * @openapi
 * /users:
 *  get:
 *      summary: Get all users
 *      tags: [Users]
 *      security:
 *          - ApiKey: []
 *      responses:
 *        200:
 *          description: Get all users successfully 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                    example: 200
 *                  message:
 *                    type: string
 *                    example: "Get all users successfully"
 *                  users:
 *                      type: array
 *                      items:
 *                          $ref: "#/components/schemas/User"
 *        401:
 *          description: Unauthorised
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 401
 *                  message:
 *                    type: string
 *                    example: "Authentication error"
 *        403:
 *          description: Forbidden
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 403
 *                  message:
 *                    type: string
 *                    example: "The user does not have permission to access user information."
 *        500:
 *          description: Database error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                  message:
 *                    type: string
 *                example:
 *                  status: 500
 *                  message: "Error processing request"
 */
userRouter.get("/", auth(["admin", "teacher"]),  getAllUsers)

/**
 * @openapi
 * /users/{id}:
 *  get:
 *      summary: Get user by ID
 *      tags: [Users]
 *      security:
 *        - ApiKey: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: User ID
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Get user by ID successfully 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 200
 *                  message:
 *                    type: string
 *                    example: "Get user by ID successfully"
 *                  user:
 *                      $ref: "#/components/schemas/User"
 *        400:
 *          description: Validation Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 400
 *                  message:
 *                    type: string
 *                    example: "Invalid ID format"
 *        401:
 *          description: Unauthorised
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 401
 *                  message:
 *                    type: string
 *                    example: "Authentication error"
 *        403:
 *          description: Forbidden
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 403
 *                  message:
 *                    type: string
 *                    example: "The user does not have permission to access user information."
 *        404:
 *          description: Not Found 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 404
 *                  message:
 *                    type: string
 *                    example: "User ID not found"
 *        500:
 *          description: Database error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                  message:
 *                    type: string
 *                example:
 *                  status: 500
 *                  message: "Error processing request"
 */
userRouter.get("/:id", auth(["admin", "teacher"]), getUserById)

/**
 * @openapi
 * /users/key/{authenticationKey}:
 *    get:
 *      summary: Get user by authentication key
 *      tags: [Users]
 *      parameters:
 *        - name: authenticationKey
 *          in: path
 *          description: User authentication key
 *          required: true
 *          schema:
 *              type: string
 *      responses:
 *        200:
 *          description: Get user by authentication key successfully 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                    example: 200
 *                  message:
 *                    type: string
 *                    example: "Get user by authentication key successfully"
 *                  user:
 *                      $ref: "#/components/schemas/User"
 *        401:
 *          description: Unauthorised
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 401
 *                  message:
 *                    type: string
 *                    example: "Authentication error"
 *        404:
 *          description: Not Found 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 404
 *                  message:
 *                    type: string
 *                    example: "User not found with authentication key"
 *        500:
 *          description: Database error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                  message:
 *                    type: string
 *                example:
 *                  status: 500
 *                  message: "Error processing request"
 */
userRouter.get("/key/:authenticationKey", getUserByAuthenticationKey)

/**
 * @openapi
 * /users:
 *  post:
 *      summary: Create a new user
 *      tags: [Users]
 *      security:
 *        - ApiKey: [] 
 *      requestBody:
 *          description: Create user object
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/NewUser"
 *      responses:
 *          200:
 *              description: Created user successfully 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  example: 200
 *                              message:
 *                                  type: string
 *                                  example: "Created user successfully"
 *                              user:
 *                                  $ref: "#/components/schemas/User"
 *          401:
 *              description: Unauthorised
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                                  example: 401
 *                              message:
 *                                  type: string
 *                                  example: "Authentication error"
 *          403:
 *              description: Forbidden
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                                  example: 403
 *                              message:
 *                                  type: string
 *                                  example: "The user does not have permission to access user information."
 *          409:
 *              description: Email address already used with another account.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                type: integer
 *                                example: 409
 *                              message:
 *                                type: string
 *                                example: "Email account already used with another account."
 *          500:
 *              description: Database error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *                          example:
 *                              status: 500
 *                              message: "Error processing request"
 */
userRouter.post("/", auth(["admin","teacher"]), createUser)

/**
 * @openapi
 * /users/{id}:
 *  put:
 *      summary: Create a new user with ID
 *      tags: [Users]
 *      security:
 *        - ApiKey: [] 
 *      parameters:
 *        - name: id
 *          in: path  
 *          description: User ID
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *          description: Create user object
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/NewUser"
 *      responses:
 *          200:
 *              description: Created user with id successfully 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  example: 200
 *                              message:
 *                                  type: string
 *                                  example: "Created user with id successfully"
 *                              user:
 *                                  $ref: "#/components/schemas/User"
 *          400:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                type: integer
 *                                example: 400
 *                              message:
 *                                type: string
 *                                example: "Invalid user ID format"
 *          401:
 *              description: Unauthorised
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                                  example: 401
 *                              message:
 *                                  type: string
 *                                  example: "Authentication error"
 *          403:
 *              description: Forbidden
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                                  example: 403
 *                              message:
 *                                  type: string
 *                                  example: "The user does not have permission to access user information."
 *          409:
 *              description: Email address already used with another account.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                type: integer
 *                                example: 409
 *                              message:
 *                                type: string
 *                                example: "Email account already used with another account."
 *          500:
 *              description: Database error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *                          example:
 *                              status: 500
 *                              message: "Error processing request"
 */
userRouter.put("/:id", auth(["admin","teacher"]), createUserWithId)

/**
 * @openapi
 * /users/many:
 *  post:
 *      summary: Create multiple users
 *      tags: [Users]
 *      security:
 *        - ApiKey: [] 
 *      requestBody:
 *          description: Create user object
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: "#/components/schemas/NewUser"
 *      responses:
 *          200:
 *              description: Created multiple users successfully 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  example: 200
 *                              message:
 *                                  type: string
 *                                  example: "Created multiple users successfully"
 *                              users:
 *                                  type: array
 *                                  items:
 *                                      $ref: "#/components/schemas/User"
 *          401:
 *              description: Unauthorised
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                                  example: 401
 *                              message:
 *                                  type: string
 *                                  example: "Authentication error"
 *          403:
 *              description: Forbidden
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                                  example: 403
 *                              message:
 *                                  type: string
 *                                  example: "The user does not have permission to access user information."
 *          409:
 *              description: Email address already used with another account.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                type: integer
 *                                example: 409
 *                              message:
 *                                type: string
 *                                example: "Email account already used with another account."
 *          500:
 *              description: Database error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *                          example:
 *                              status: 500
 *                              message: "Error processing request"
 */
userRouter.post("/many", auth(["admin","teacher"]), createMany)

/**
 * @openapi
 * /users/update/user:
 *  patch:
 *      summary: Update a user by ID
 *      tags: [Users]
 *      security:
 *        - ApiKey: []
 *      requestBody:
 *          description: Update user object
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/UpdateUser"
 *      responses:
 *        200:
 *          description: Updated user successfully 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                    example: 200
 *                  message:
 *                    type: string
 *                    example: "Updated user successfully"
 *                  user:
 *                      $ref: "#/components/schemas/User"
 *        401:
 *          description: Unauthorised
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 401
 *                  message:
 *                    type: string
 *                    example: "Authentication error"
 *        403:
 *          description: Forbidden
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 403
 *                  message:
 *                    type: string
 *                    example: "The user does not have permission to access user information."
 *        404:
 *          description: Not Found 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 404
 *                  message:
 *                    type: string
 *                    example: "User ID not found"
 *        500:
 *          description: Database error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                  message:
 *                    type: string
 *                example:
 *                  status: 500
 *                  message: "Error processing request"
 */
userRouter.patch("/update/user", auth(["admin","teacher"]), updateUserById)

/**
 * @openapi
 * /users/update/many:
 *  patch:
 *      summary: Update multiple users by ID
 *      tags: [Users]
 *      security:
 *        - ApiKey: []
 *      requestBody:
 *          description: Update users object
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: "#/components/schemas/UpdateUser"
 *      responses:
 *        200:
 *          description: Updated multiple users successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                    example: 200
 *                  message:
 *                    type: string
 *                    example: "Updated multiple users successfully"
 *                  users:
 *                    type: array
 *                    items:
 *                      $ref: "#/components/schemas/User"
 *        401:
 *          description: Unauthorised
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 401
 *                  message:
 *                    type: string
 *                    example: "Authentication error"
 *        403:
 *          description: Forbidden
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 403
 *                  message:
 *                    type: string
 *                    example: "The user does not have permission to access user information."
 *        404:
 *          description: Not Found 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 404
 *                  message:
 *                    type: string
 *                    example: "No users were updated"
 *        500:
 *          description: Database error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                  message:
 *                    type: string
 *                example:
 *                  status: 500
 *                  message: "Error processing request"
 */
userRouter.patch("/update/many", auth(["admin", "teacher"]), updateManyUser)

/**
 * @openapi
 * /users/{id}:
 *  delete:
 *      summary: Delete a user by ID
 *      tags: [Users]
 *      security:
 *        - ApiKey: []
 *      parameters:
 *          - name: id
 *            in: path
 *            description: User ID
 *            required: true
 *            schema:
 *               type: string
 *      responses:
 *          200:
 *              description: User deleted sucessfully 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  example: 200
 *                              message:
 *                                  type: string
 *                                  example: "User deleted successfully"
 *          400:
 *              description: Validation Error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                                  example: 400
 *                              message:
 *                                  type: string
 *                                  example: "Invalid ID format"
 *          401:
 *              description: Unauthorised
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                                  example: 401
 *                              message:
 *                                  type: string
 *                                  example: "Authentication error"
 *          403:
 *              description: Forbidden
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                                  example: 403
 *                              message:
 *                                  type: string
 *                                  example: "The user does not have permission to access user information."
 *          404:
 *              description: Not Found 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  example: 200
 *                              message:
 *                                  type: string
 *                                  example: "User ID not found"
 *          500:
 *              description: Database error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  example: 500
 *                              message:
 *                                  type: string
 *                                  example: "Error processing request"
 */
userRouter.delete("/:id", auth(["admin", "teacher"]), deleteUserById)


/**
 * @openapi
 * /users/delete/many:
 *  delete:
 *      summary: Delete multiple users by ID
 *      tags: [Users]
 *      security:
 *        - ApiKey: []
 *      requestBody:
 *          description: Delete users object
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          ids:
 *                              type: array
 *                              items:
 *                                type: string
 *                              example: ["65cea708cdd7c5a4c305bc50", "65cea708cdd7c5a4c305bc51"]
 *      responses:
 *          200:
 *              description: Users deleted sucessfully 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  example: 200
 *                              message:
 *                                  type: string
 *                                  example: "Users deleted successfully"
 *          400:
 *              description: Validation Error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                                  example: 400
 *                              message:
 *                                  type: string
 *                                  example: "Invalid ID format"
 *          401:
 *              description: Unauthorised
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                                  example: 401
 *                              message:
 *                                  type: string
 *                                  example: "Authentication error"
 *          403:
 *              description: Forbidden
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                                  example: 403
 *                              message:
 *                                  type: string
 *                                  example: "The user does not have permission to access user information."
 *          404:
 *              description: Not Found 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                                  example: 404
 *                              message:
 *                                  type: string
 *                                  example: "Users not found to delete"
 *          500:
 *              description: Database error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  example: 500
 *                              message:
 *                                  type: string
 *                                  example: "Error processing request"
 */
userRouter.delete("/delete/many", auth(["admin", "teacher"]), deleteManyByIds)

/**
 * @openapi
 * /users/update/usersrole:
 *  patch:
 *      summary: Update access level for at least two users in the same query, based on a date range in which the users were created
 *      tags: [Users]
 *      security:
 *          - ApiKey: []
 *      requestBody:
 *          description: Update users object
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          startDate:
 *                              type: string
 *                              example: 2024-01-01
 *                          endDate:
 *                              type: string
 *                              example: 2024-02-01
 *                          role:
 *                              type: string
 *                              example: admin
 *      responses:
 *        200:
 *          description: Updated users role successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                    example: 200
 *                  message:
 *                    type: string
 *                    example: "Updated users role successfully"
 *                  users:
 *                    type: array
 *                    items:
 *                      $ref: "#/components/schemas/User"
 *        401:
 *          description: Unauthorised
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 401
 *                  message:
 *                    type: string
 *                    example: "Authentication error"
 *        403:
 *          description: Forbidden
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 403
 *                  message:
 *                    type: string
 *                    example: "The user does not have permission to access user information."
 *        404:
 *          description: Not Found 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 404
 *                  message:
 *                    type: string
 *                    example: "Users not found to update roles."
 *        500:
 *          description: Database error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                  message:
 *                    type: string
 *                example:
 *                  status: 500
 *                  message: "Error processing request"
 */
userRouter.patch("/update/usersrole", auth(["admin"]), updateRolesByDateRange)

/**
 * @openapi
 * /users/delete/deleterolesbydaterange:
 *  delete:
 *      summary: Delete multiple users that have the Student role and last logged in between two given dates
 *      tags: [Users]
 *      security:
 *          - ApiKey: []
 *      requestBody:
 *          description: Delete users object
 *          required: false
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          startDate:
 *                              type: string
 *                              example: 2024-01-01
 *                          endDate:
 *                              type: string
 *                              example: 2024-02-01
 *                          userRole:
 *                              type: string
 *                              example: student
 *      responses:
 *        200:
 *          description: Delete multiple users between date range successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 200
 *                  message:
 *                    type: string
 *                    example: "Delete multiple users between date range successfully."
 *        401:
 *          description: Unauthorised
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 401
 *                  message:
 *                    type: string
 *                    example: "Authentication error"
 *        403:
 *          description: Forbidden
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 403
 *                  message:
 *                    type: string
 *                    example: "The user does not have permission to access user information."
 *        404:
 *          description: Not Found 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                  message:
 *                    type: string
 *                example:
 *                  status: 404
 *                  message: "No users found with given role and date range."
 *        500:
 *          description: Database error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                  message:
 *                    type: string
 *                example:
 *                  status: 500
 *                  message: "Error processing request"
 */
userRouter.delete("/delete/deleterolesbydaterange", auth(["admin"]), deleteRolesByDateRange)

export default userRouter