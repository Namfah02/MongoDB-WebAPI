import { Router } from "express";
import auth from"../middleware/auth.js"
import { createMany, createNewReading, deleteManyByIds, deleteReadingById, getDeviceByDate, getMaxPrecipLastFiveMonths, getMaxTempByDateRange, getReadingByDateRange, getReadingById, getReadingsByPage, updateManyReadings, updatePrecipById, updateReadingById } from "../controllers/readings.js";


const readingsRouter = Router()


/**
 * @openapi
 * /readings/{id}:
 *    get:
 *      summary: Get weather data readings by ID
 *      tags: [Readings]
 *      security:
 *        - ApiKey: []
 *      parameters:
 *        - name: id
 *          in: path  
 *          description: Reading ID
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Response object with weather data reading
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
 *                    example: Get weather data reading by ID
 *                  readings:
 *                     $ref: "#/components/schemas/WeatherReading"
 *        400:
 *          description: Validation error
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
 *                    example: "The user does not have permission to get weather data readings."
 *        404:
 *          description: Data not found
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
 *                    example: "No wather data reading was found"
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
readingsRouter.get("/:id", auth(["admin", "teacher", "student"]), getReadingById)

/**
 * @openapi
 * /readings/page/{page}:
 *  get:
 *      summary: Get weather data readings by page
 *      tags: [Readings]
 *      security:
 *        - ApiKey: []
 *      parameters:
 *        - name: page
 *          in: path  
 *          description: Page number
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Response object with weather data readings array
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
 *                    example: Get weather data readings by page
 *                  readings:
 *                    type: array
 *                    items:
 *                      $ref: "#/components/schemas/WeatherReading"
 *        400:
 *          description: Bad request
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
 *                    example: "Invalid data. Page must be a number"
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
 *                    example: "The user does not have permission to get weather data readings."
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
 *                    example: "Data not found with page number provided"
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
readingsRouter.get("/page/:page", auth(["admin", "teacher", "student"]), getReadingsByPage)

/**
 * @openapi
 * /readings/date/{startDate}/{endDate}:
 *   get:
 *      summary: Get weather data readings by date range
 *      tags: [Readings]
 *      security:
 *        - ApiKey: []
 *      parameters:
 *          - name: startDate
 *            in: path
 *            description: The start date of reading
 *            required: true
 *            schema:
 *               type: string
 *          - name: endDate
 *            in: path
 *            description: The end date of reading
 *            required: true
 *            schema:
 *               type: string
 *      responses:
 *        200:
 *          description: Response object with weather data readings array
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
 *                    example: Get weather data readings by date range
 *                  readings:
 *                    type: array
 *                    items:
 *                      $ref: "#/components/schemas/WeatherReading"
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
 *                    example: "The user does not have permission to get weather data readings."
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
 *                    example: "No weather data readings found for the provided date range"
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
readingsRouter.get("/date/:startDate/:endDate", auth(["admin", "teacher", "student"]), getReadingByDateRange)

/**
 * @openapi
 * /readings:
 *    post:
 *      summary: Create a new weather data reading
 *      tags: [Readings]
 *      security:
 *        - ApiKey: []
 *      requestBody:
 *        description: Create weather data reading object
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/NewWeatherReading"
 *      responses:
 *        200:
 *          description: Weather data reading created successfully 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Weather data reading created successfully"
 *                 readings:
 *                    $ref: "#/components/schemas/WeatherReading"
 *        400:
 *          description: Validation error
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
 *                    example: "Fields invalid format"
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
 *                    example: "The user does not have permission to modify readings."
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
readingsRouter.post("/", auth(["admin", "teacher", "sensor"]), createNewReading)

/**
 * @openapi
 * /readings/many:
 *  post:
 *      summary: Create new multiple weather data readings
 *      tags: [Readings]
 *      security:
 *        - ApiKey: []
 *      requestBody:
 *        description: Create weather data readings object
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:    
 *                  $ref: "#/components/schemas/NewWeatherReading"
 *      responses:
 *        200:
 *          description: Weather data readings created successfully 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Weather data readings created successfully 
 *                 readings:
 *                      type: array
 *                      items: 
 *                          $ref: "#/components/schemas/WeatherReading"
 *        400:
 *          description: Validation error
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
 *                    example: "Fields invalid format"
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
 *                    example: "The user does not have permission to modify readings."
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
readingsRouter.post("/many", auth(["admin", "teacher", "sensor"]), createMany)

/**
 * @openapi
 * /readings:
 *  patch:
 *      summary: Update a weather data reading by ID
 *      tags: [Readings]
 *      security:
 *        - ApiKey: []
 *      requestBody:
 *          description: Update weather data reading object
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/UpdateWeatherReading"
 *      responses:
 *        200:
 *          description: Weather data reading updated successfully 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Weather data reading updated successfully"
 *                 readings:
 *                    $ref: "#/components/schemas/WeatherReading"
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
 *                    example: "The user does not have permission to modify readings."
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
 *                    example: "No weather data readings were updated"
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
readingsRouter.patch("/", auth(["admin", "teacher"]), updateReadingById)

/**
 * @openapi
 * /readings/update/many:
 *  patch:
 *      summary: Update multiple weather data readings by ID
 *      tags: [Readings]
 *      security:
 *        - ApiKey: []
 *      requestBody:
 *          description: Update weather data readings object
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                        $ref: "#/components/schemas/UpdateWeatherReading"                                                                  
 *      responses:
 *        200:
 *          description: Weather data readings updated successfully 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Weather data readings updated successfully"
 *                 reading:
 *                      type: array
 *                      items:
 *                          $ref: "#/components/schemas/WeatherReading"
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
 *                    example: "The user does not have permission to modify readings."
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
 *                    example: "No weather data readings were updated"
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
readingsRouter.patch("/update/many", auth(["admin", "teacher"]), updateManyReadings)

/**
 * @openapi
 * /readings/{id}:
 *  delete:
 *      summary: Delete a weather data reading by ID
 *      tags: [Readings]
 *      security:
 *        - ApiKey: []
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Reading ID
 *            required: true
 *            schema:
 *               type: string
 *      responses:
 *        200:
 *          description: Weather data reading deleted successfully 
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
 *                    example: "Weather data reading deleted successfully"
 *        400:
 *          description: Validation error
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
 *                    example: "The user does not have permission to modify readings."
 *        404:
 *          description: Not found
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
 *                    example: "Weather data reading not found to delete"
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
readingsRouter.delete("/:id", auth(["admin", "teacher"]), deleteReadingById)

/**
 * @openapi
 * /readings/delete/many:
 *    delete:
 *      summary: Delete multiple weather data readings by ID
 *      tags: [Readings]
 *      security:
 *        - ApiKey: []
 *      requestBody:
 *          description: Delete weather data readings object
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
 * 
 *      responses:
 *        200:
 *          description: Multiple weather data readings deleted successfully 
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
 *                    example: "Multiple weather data readings deleted successfully"
 *        400:
 *          description: Validation error
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
 *                    example: "The user does not have permission to modify readings."
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
 *                    example: "Weather data readings not found to delete"
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
readingsRouter.delete("/delete/many",auth(["admin", "teacher"]), deleteManyByIds)


/**
 * @openapi
 * /readings/maxprecipitation/{deviceName}:
 *  get:
 *      summary: Get maximum precipitation recorded in the last 5 months for a specific device name
 *      tags: [Readings]
 *      security:
 *        - ApiKey: []
 *      parameters:
 *          - name: deviceName
 *            in: path
 *            description: Device name of reading
 *            required: true
 *            schema:
 *               type: string
 *      responses:
 *        200:
 *          description: Response object with weather data reading
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
 *                    example: "Get weather data readings by maximum precipitation recorded in the last 5 Months for a specific device name successfully."
 *                  readings:
 *                      type: object
 *                      properties:
 *                          deviceName: 
 *                              type: string
 *                              example: Woodford_Sensor
 *                          precipitation:
 *                              type: number
 *                              example: 0.085
 *                          time:
 *                              type: string
 *                              format: date-time
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
 *                    example: "The user does not have permission to get weather data readings."
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
 *                    example: "Maximum precipitation data was not found within the last 5 months with the given device name."
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
readingsRouter.get("/maxprecipitation/:deviceName", auth(["admin", "teacher", "student"]), getMaxPrecipLastFiveMonths)

/**
 * @openapi
 * /readings/devicedate/{deviceName}/{datetime}:
 *  get:
 *      summary: Get temperature, atmospheric, radiation and precipitation spacific station by given date time
 *      tags: [Readings]
 *      security:
 *        - ApiKey: []
 *      parameters:
 *          - name: deviceName
 *            in: path
 *            description: Device name of reading
 *            required: true
 *            schema:
 *               type: string
 *          - name: datetime
 *            in: path
 *            description: Date time of reading
 *            required: true
 *            schema:
 *               type: string
 *      responses:
 *        200:
 *          description: Response object with weather data reading
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
 *                    example: "Get temperature, atmospheric, radiation and precipitation spacific station by given date time successfully"
 *                  readings:
 *                      type: object
 *                      properties:
 *                          temperature: 
 *                              type: number
 *                              example: 22.74
 *                          atmosphericPressure:
 *                              type: number
 *                              example: 128.02
 *                          solarRadiation:
 *                              type: number
 *                              example: 113.21
 *                          precipitation:
 *                              type: number
 *                              example: 0.085
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
 *                    example: "The user does not have permission to get weather data readings."
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
 *                    example: "Data not found within given device and date time"
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
readingsRouter.get("/devicedate/:deviceName/:datetime", auth(["admin", "teacher", "student"]), getDeviceByDate)


/**
 * @openapi
 * /readings/maxtemperature/{startDate}/{endDate}:
 *  get:
 *      summary: Get maximum temperature for all stations by date range
 *      tags: [Readings]
 *      security:
 *        - ApiKey: []
 *      parameters:
 *          - name: startDate
 *            in: path
 *            description: The start date of reading
 *            required: true
 *            schema:
 *               type: string
 *          - name: endDate
 *            in: path
 *            description: The end date of reading
 *            required: true
 *            schema:
 *               type: string
 *      responses:
 *        200:
 *          description: Response object with weather data readings array
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
 *                    example: "Get maximum temperature for all stations by date range successfully"
 *                  readings:
 *                     type: array
 *                     items:
 *                      type: object
 *                      properties:
 *                          deviceName: 
 *                              type: string
 *                              example: Woodford_Sensor
 *                          temperature: 
 *                              type: number
 *                              example: 22.74
 *                          time:
 *                              type: string
 *                              format: date-time     
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
 *                    example: "The user does not have permission to get weather data readings." 
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
 *                    example: "Maximum temperature data not found within the specified date range."
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
readingsRouter.get("/maxtemperature/:startDate/:endDate", auth(["admin", "teacher", "student"]), getMaxTempByDateRange)


/**
 * @openapi
 * /readings/update/precipitation:
 *  patch:
 *      summary: Update a specific precipitation value by ID
 *      tags: [Readings]
 *      security:
 *        - ApiKey: []
 *      requestBody:
 *          description: Update reading object
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties: 
 *                              _id:
 *                                  type: string
 *                              precipitation:
 *                                  type: number
 *                                  example: 0.085
 *      responses:
 *        200:
 *          description: Response object with weather data reading 
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
 *                    example: "Updated reading precipitation successfully"
 *                  readings:
 *                    $ref: "#/components/schemas/WeatherReading"
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
 *                    example: "The user does not have permission to modify readings."
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
 *                    example: "No weather data reading was updated"
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
readingsRouter.patch("/update/precipitation", auth(["admin"]), updatePrecipById)

export default readingsRouter