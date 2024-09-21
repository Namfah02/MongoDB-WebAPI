import { Router } from "express";
import {loginUser, logoutUser, registerUser} from "../controllers/auth.js"

const authRouter = Router()

/**
 * @openapi
 * /auth/login:
 *  post:
 *    summary: Attempt username and password based authentication
 *    tags: [Authentication]
 *    requestBody:
 *      description: Attempt user login with email and password
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: abc@web.com
 *              password:
 *                type: string
 *                example: Abc123456!
 *    responses:
 *      200:
 *        description: Login successful
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: number
 *                  example: 200
 *                message:
 *                  type: string
 *                  example: "Logged in successfully"
 *                authenticationKey:
 *                  type: string
 *      401:
 *        description: Invalid credentials
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: number
 *                message:
 *                  type: string
 *              example:
 *                status: 400
 *                message: "Invalid credentials"
 *      500:
 *        description: Database error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: number
 *                message:
 *                  type: string
 *              example:
 *                status: 500
 *                message: "Error processing request"
 */
authRouter.post("/login", loginUser)

/**
 * @openapi
 * /auth/logout:
 *  post:
 *    summary: Logs the current user out
 *    tags: [Authentication]
 *    requestBody:
 *      description: User logout object
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              authenticationKey:
 *                type: string
 *    responses:
 *      200:
 *        description: Logged out successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 200
 *                message:
 *                  type: string
 *                  example: " Logged out successfully"
 *      404:
 *         description: failed to find user to log out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *               example:
 *                 status: 404
 *                 message: failed to find user
 *      500:
 *        description: Database error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: number
 *                message:
 *                  type: string
 *              example:
 *                status: 500
 *                message: "Error processing request"
 */
authRouter.post("/logout", logoutUser)

/**
 * @openapi
 * /auth/register:
 *  post:
 *    summary: Register a new user
 *    tags: [Authentication]
 *    requestBody:
 *      description: User register object
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *                example: John
 *              lastName:
 *                type: string
 *                example: Doe
 *              email:
 *                type: string
 *                format: email
 *                example: test@test.com
 *              password:
 *                type: string
 *                format: password
 *                example: CreatestrongPassword123!
 *    responses:
 *      200:
 *        description: User registered successfully 
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 200
 *                message:
 *                  type: string
 *                  example: "User registered successfully"
 *                user:
 *                  type: object
 *                  properties:
 *                    _id: 
 *                      type: string
 *                      example: 65cea708cdd7c5a4c305bc4e
 *                    firstName: 
 *                      type: string
 *                      example: John
 *                    lastName:
 *                      type: string
 *                      example: Doe  
 *                    email:
 *                      type: string
 *                      format: email
 *                      example: webabc@test.com
 *                    password:
 *                      type: string
 *                      format: password
 *                    role:
 *                      type: string
 *                      enum:
 *                        - admin
 *                        - teacher
 *                        - sensor
 *                        - student
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                    lastLoggedIn:
 *                      type: string
 *                      nullable: true
 *                      format: date-time
 *                    authenticationKey:
 *                      type: string
 *                      nullable: true
 *                      example: ""
 *      409:
 *        description: Email address already used with another account.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 409
 *                message:
 *                  type: string
 *                  example: "Email account already used with another account."
 *      500:
 *        description: Database error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: number
 *                message:
 *                  type: string
 *              example:
 *                status: 500
 *                message: "Error processing request"
 */
authRouter.post("/register", registerUser)

export default authRouter