import * as Readings from "../models/reading.js"
import * as Users from "../models/user.js"

/**
 * GET /readings/:id
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function getReadingById(req, res) {
  const readingID = req.params.id

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)
  const allowedRoles = ["admin", "student", "teacher"]

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to get weather data readings.",
    })
    // Return to stop running this function
    return
  }

  //MongoDB object ID validation
  const idFormat = /^[0-9a-fA-F]{24}$/
  if (!idFormat.test(readingID)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid ID format",
    })
  }

  Readings.getById(readingID)
    .then((reading) => {
      res.status(200).json({
        status: 200,
        message: "Get weather data reading by ID successfully",
        reading: reading,
      })
    })
    .catch((error) => {
      if (error === "Reading not found") {
        return res.status(404).json({
          status: 404,
          message: "Weather data reading not found with ID: " + readingID,
        })
      }
      res.status(500).json({
        status: 500,
        message: "Failed to get reading by ID",
      })
    })
}

/**
 * GET /readings/page/:page
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function getReadingsByPage(req, res) {
  const pageSize = 5
  const page = parseInt(req.params.page)

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)
  const allowedRoles = ["admin", "student", "teacher"]

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to get weather data readings.",
    })
    // Return to stop running this function
    return
  }

  //Check the input provide should be number of page
  if (isNaN(page)) {
    return res.status(400).json({
      status: 400,
      message: "Page must be a number",
    })
  }

  const readings = await Readings.getByPage(page, pageSize)

  //Convert _id to string
  const readingsIdtoString = readings.map((reading) => {
    return { ...reading, _id: reading._id.toString() }
  })
  if (!readingsIdtoString || readingsIdtoString.length === 0) {
    return res.status(404).json({
      status: 404,
      message: "No weather data readings found for the page number provided",
    })
  }

  res.status(200).json({
    status: 200,
    message: "Get paginated weather data readings on page " + page,
    readings: readingsIdtoString,
  })
}

/**
 * GET readings/date/:startdate/:endDate
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function getReadingByDateRange(req, res) {
  const { startDate, endDate } = req.params

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)
  const allowedRoles = ["admin", "student", "teacher"]

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to get weather data readings.",
    })
    // Return to stop running this function
    return
  }

  Readings.getByDateRange(startDate, endDate)
    .then((reading) => {
      if (!reading || reading.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No weather data readings found for the provided date range",
        })
      }
      res.status(200).json({
        status: 200,
        message: "Get weather data readings by date range successfully",
        reading: reading,
      })
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get weather data readings by date range",
      })
    })
}

/**
 * POST /readings/
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function createNewReading(req, res) {
  const readingData = req.body

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)
  const allowedRoles = ["admin", "sensor", "teacher"]

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    res.status(403).json({
      status: 403,
      message: "You do not have permission to modify readings.",
    })
    // Return to stop running this function
    return
  }


  const reading = Readings.Reading(
    null,
    readingData.deviceName,
    readingData.precipitation,
    readingData.latitude,
    readingData.longitude,
    new Date().toISOString(),
    readingData.atmosphericPressure,
    readingData.humidity,
    readingData.maxWindSpeed,
    readingData.solarRadiation,
    readingData.temperature,
    readingData.vaporPressure,
    readingData.windDirection
  )

  Readings.create(reading).then((reading) => {
    res.status(200).json({
      status: 200,
      message: "Created weather data reading successfully",
      reading: reading,
    })
  })
}

/**
 * POST /readings/many
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function createMany(req, res) {
  const readingsData = req.body

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)
  const allowedRoles = ["admin", "sensor", "teacher"]

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to modify readings.",
    })
    // Return to stop running this function
    return
  }
  

  const readings = []

  for (const readingData of readingsData) {
    const { _id, ...readingWithoutId } = readingData
    const reading = Readings.Reading(
      null,
      readingData.deviceName,
      readingData.precipitation,
      readingData.latitude,
      readingData.longitude,
      new Date().toISOString(),
      readingData.atmosphericPressure,
      readingData.humidity,
      readingData.maxWindSpeed,
      readingData.solarRadiation,
      readingData.temperature,
      readingData.vaporPressure,
      readingData.windDirection
    )
    readings.push(reading)
  }

  // Create readings in to the database
  const createdReadings = await Readings.createMany(readings)
    res.status(200).json({
      status: 200,
      message: `Created ${createdReadings.length} weather data readings successfully`,
      reading: createdReadings,
    })
}

/**
 * PATCH /readings
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function updateReadingById(req, res) {
  // Get reading data out of the request
  const readingData = req.body

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)

  if (currentUser.role !== "admin" && currentUser.role !== "teacher") {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to modify readings.",
    })
    // Return to stop running this function
    return
  }

  // Convert the reading data into a reading model object
  const updatedReading = Readings.Reading(
    readingData._id,
    readingData.deviceName,
    readingData.precipitation,
    readingData.latitude,
    readingData.longitude,
    new Date().toISOString(),
    readingData.atmosphericPressure,
    readingData.humidity,
    readingData.maxWindSpeed,
    readingData.solarRadiation,
    readingData.temperature,
    readingData.vaporPressure,
    readingData.windDirection
  )

  // Use the update model function to update this reading in the database
  Readings.update(updatedReading)
    .then((reading) => {
      if (!reading._id && reading.modifiedCount === 0) {
        return res.status(404).json({
          status: 404,
          message: "Weather data reading not found with ID: " + updatedReading._id,
        })
      }
      res.status(200).json({
        status: 200,
        message: "Updated weather data reading successfully",
        reading: reading,
      })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        status: 500,
        message: "Failed to update weather data reading",
      })
    })
}

/**
 * PATCH /readings/many
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function updateManyReadings(req, res) {
  // Get reading data out of the request
  const readingData = req.body

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)

  if (currentUser.role !== "admin" && currentUser.role !== "teacher") {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to modify weather data readings.",
    })
    // Return to stop running this function
    return
  }

  // Use the update model function to update this reading in the database
  Readings.updateMany(readingData)
    .then((result) => {
      if (result.modifiedCount === 0) {
        res.status(404).json({
          status: 404,
          message: "No weather data readings were updated",
        })
      } else {
        res.status(200).json({
          status: 200,
          message: `${result.modifiedCount} weather data readings updated successfully`,
        })
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to update multiple weather data readings",
      })
    })
}

/**
 * DELETE /readings/:id
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function deleteReadingById(req, res) {
  const readingID = req.params.id

    const authenticationKey = req.get("X-AUTH-KEY")
    const currentUser = await Users.getByAuthenticationKey(authenticationKey)

    if (currentUser.role !== "admin" && currentUser.role !== "teacher") {
      res.status(403).json({
        status: 403,
        message: "The user does not have permission to modify weather data readings.",
      })
      // Return to stop running this function
      return
    }

  //MongoDB object ID validation
  const idFormat = /^[0-9a-fA-F]{24}$/
  if (!idFormat.test(readingID)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid ID format",
    })
  }

  Readings.deleteById(readingID)
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({
          status: 200,
          message: "Weather data reading deleted successfully",
        })
      } else {
        res.status(404).json({
          status: 404,
          message: "Weather data reading not found",
        })
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to delete weather data reading",
        error: error.message,
      })
    })
}

/**
 * DELETE /readings/many
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function deleteManyByIds(req, res) {
  const readingIds = req.body.ids

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)

  if (currentUser.role !== "admin" && currentUser.role !== "teacher") {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to modify weather data readings.",
    })
    // Return to stop running this function
    return
  }

  const idFormat = /^[0-9a-fA-F]{24}$/
  for (const id of readingIds) {
    if (!idFormat.test(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid ID format",
      })
    }
  }

  Readings.deleteManyByIds(readingIds)
    .then((result) => {
      if (result.deletedCount === 0) {
        res.status(404).json({
          status: 404,
          message: "Weather data readings not found to delete",
        })
        return
      }

      res.status(200).json({
        status: 200,
        message: `${result.deletedCount} weather data readings deleted successfully`,
      })
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to delete weather data readings",
      })
    })
}

/**
 * GET /maxprecipitation/:deviceName
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */

export async function getMaxPrecipLastFiveMonths(req, res) {
  const deviceName = req.params.deviceName

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)
  const allowedRoles = ["admin", "student", "teacher"]

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to get weather data readings.",
    })
    // Return to stop running this function
    return
  }

  Readings.getMaxPrecipLastFiveMonths(deviceName)
    .then((reading) => {
      if (reading.length === 0) {
        res.status(404).json({
          status: 404,
          message:
            "Maximum precipitation data was not found within the last 5 months with the given device name.",
        })
      } else {
        res.status(200).json({
          status: 200,
          message:
            "Get maximum precipitation in last 5 months for given device name",
          reading: reading,
        })
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get maximum precipitation in last 5 months",
      })
    })
}

/**
 * GET /readingsdevicedate/:deviceName/:time
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function getDeviceByDate(req, res) {
  const deviceName = req.params.deviceName
  const datetime = req.params.datetime

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)
  const allowedRoles = ["admin", "student", "teacher"]

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to get weather data readings.",
    })
    // Return to stop running this function
    return
  }

  Readings.getDeviceByDate(deviceName, datetime)
    .then((reading) => {
      if (reading.length === 0) {
        res.status(404).json({
          status: 404,
          message: "Data not found within given device and date time",
        })
      } else {
        res.status(200).json({
          status: 200,
          message:
            "Get temperature, atmospheric, radiation and precipitation spacific station by given date time",
          reading: reading,
        })
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get weather data reading by device name and date",
        error,
      })
    })
}

/**
 * GET /maxtemperature/:startDate/:endDate
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function getMaxTempByDateRange(req, res) {
  const { startDate, endDate } = req.params

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)
  const allowedRoles = ["admin", "student", "teacher"]

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to get weather data readings.",
    })
    // Return to stop running this function
    return
  }

  Readings.getMaxTempByDateRange(startDate, endDate)
    .then((readings) => {
      if (readings.length === 0) {
        res.status(404).json({
          status: 404,
          message:
            "Maximum temperature data not found within the specified date range",
        })
      } else {
        res.status(200).json({
          status: 200,
          message: "Get maximum temperature for all stations by date range",
          readings: readings,
        })
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get maximum temperature",
      })
    })
}

/**
 * PATCH /readings/precipitation
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 */
export async function updatePrecipById(req, res) {
  const precipitation = req.body["precipitation"]
  const id = req.body["_id"]

  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)

  if (currentUser.role !== "admin") {
    res.status(403).json({
      status: 403,
      message: "The user does not have permission to modify readings.",
    })
    // Return to stop running this function
    return
  }

  Readings.updatePrecipById(id, precipitation)
    .then((reading) => {
      if (reading.modifiedCount === 0) {
        return res.status(404).json({
          status: 404,
          message: "No reading was updated",
        })
      }
      res.status(200).json({
        status: 200,
        message: "Updated readings precipitation by ID",
        reading: reading,
      })
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to update readings precipitation by ID",
      })
    })
}

