import { Double, ObjectId } from "mongodb"
import { db } from "../database.js"

/**
 * Create a new reading model object
 *
 * @param {String | ObjectId | null} _id - MongoDB object ID for this reading
 * @param {String} deviceName - Device name (sensor)
 * @param {Number} precipitation - Precipitation
 * @param {Number} latitude - Latitude
 * @param {Number} longitude - Longitude
 * @param {Date} time - Date time
 * @param {Number} atmosphericPressure - Atmospheric Pressure
 * @param {Number} humidity - Humidity
 * @param {Number} maxWindSpeed - Max Wind Speed
 * @param {Number} solarRadiation - Solar Radiation
 * @param {Number} temperature - Temperature
 * @param {Number} vadorPressure - Vador Pressure
 * @param {Number} windDirection - Wind Direction
 * @returns {Object} - Reading model object
 */
export function Reading(
  _id,
  deviceName,
  precipitation,
  latitude,
  longitude,
  time,
  atmosphericPressure,
  humidity,
  maxWindSpeed,
  solarRadiation,
  temperature,
  vaporPressure,
  windDirection
) {
  return {
    _id: new ObjectId(_id),
    deviceName,
    precipitation,
    latitude,
    longitude,
    time: new Date(time),
    atmosphericPressure,
    humidity,
    maxWindSpeed,
    solarRadiation,
    temperature,
    vaporPressure,
    windDirection,
  }
}

/**
 * Get reading by ID
 *
 * @param {ObjectId} id - MongoDB ObjectId of reading
 * @returns {Promise<Object>} - A promise for the matching reading
 */
export async function getById(id) {
  // attempt to find the first matching weather reading by id
  let reading = await db
    .collection("readings")
    .findOne({ _id: new ObjectId(id) })

  // check if a weather reading was found and handle the result
  if (reading) {
    return reading
  } else {
    return Promise.reject("Reading not found")
  }
}

/**
 * Get paginated readings
 *
 * @param {Number} page - Page number (1 indexed)
 * @param {Number} size - The number of record per page
 * @returns {Promise<Object[]>} - A promise for the array of readings on the specified page
 */
export async function getByPage(page, size) {
  // Calculate page offset
  const offset = (page - 1) * size

  return db.collection("readings").find().skip(offset).limit(size).toArray()
}

/**
 * Get radings by date range (start and end)
 *
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {Promise<Array>} - A promise for the array of matching dates
 */
export async function getByDateRange(startDate, endDate) {
  // Convert the start and end dates to Date objects
  const start = new Date(startDate)
  const end = new Date(endDate)

  const readings = await db
    .collection("readings")
    .find({ time: { $gte: start, $lte: end } })
    .toArray()

  if (readings) {
    return readings
  } else {
    return Promise.reject(
      "Weather readings not found with date range provided"
    )
  }
}

/**
 * Insert the provided weather reading into the database
 *
 * @param {Object} reading - mongoDB objectId for reading
 * @returns {Promise<InsertOneResult>} - The result of the insert operation
 */
export async function create(reading) {
  // Clear _id from reading to ensure the new reading does not have an existing _id from the database,
  // as we want a new _id to be created and added to the reading object.
  delete reading.id

  // Insert the reading document and implicitly add the new _id to reading
  return db.collection("readings").insertOne(reading)
}

/**
 * Insert the provided readings into the database (createMany)
 *
 * @export
 * @async
 * @param {Object[]} readings - The readings to insert
 * @returns {Promise<InsertManyResult>} - The result of the insert operation
 */
export async function createMany(readings) {
  return db
    .collection("readings")
    .insertMany(readings)
    .then((result) => {
      for (const reading of readings) {
        reading.id = reading._id.toString()
        delete reading._id
      }
      return Promise.resolve(readings)
    })
}

/**
 * Update reading in the database
 *
 * @export
 * @async
 * @param {Object} reading - Reading to update
 * @returns {Promise<UpdateResult>} - The result of the update operation
 */

export async function update(reading) {
  // update the reading by replacing the reading by id

  // Copy reading and delete ID from this
  const readingWithoutId = { ...reading }
  delete readingWithoutId._id

  return db
    .collection("readings")
    .replaceOne({ _id: new ObjectId(reading._id) }, readingWithoutId)
}

/**
 * Update many readings in the database
 *
 * @export
 * @async
 * @param {Object[]} readings - Readings to update
 * @returns {Promise<UpdateResult>} - The result of the update operation
 */
export async function updateMany(readings) {
  const updateReadings = readings.map((reading) => {
    const readingWithoutId = { ...reading }
    const id = reading._id
    delete readingWithoutId._id
    return {
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: readingWithoutId },
      },
    }
  })
  return db.collection("readings").bulkWrite(updateReadings)
}

/**
 * Delete reading by ObjectId
 *
 * @export
 * @async
 * @param {ObjectId} id - mongoDB ObjectId for reading delete
 * @returns {Promise<DeleteResult>} - The result of the delete operation
 */
export async function deleteById(id) {
  return db.collection("readings").deleteOne({ _id: new ObjectId(id) })
}


/**
 * Delete many readings by ObjectId
 *
 * @param {ObjectId[]} readingIds - mongoDB ObjectId readings
 * @returns {Promise<DeleteManyResult>} - The result of the delete operation
 */
export async function deleteManyByIds(readingIds) {
  return db.collection("readings").deleteMany({
    _id: { $in: readingIds.map((id) => new ObjectId(id)) },
  })
}

/**
 * Get  maximum precipitation recorded in the last 5 Months for a specific device
 *
 * @param {String} deviceName - Device name
 * @returns {Promise<Object>} - A promise for the matching reading
 */
export async function getMaxPrecipLastFiveMonths(deviceName) {
  // Calculate the timestamp for five months ago
  const lastFiveMonths = new Date()
  lastFiveMonths.setMonth(lastFiveMonths.getMonth() - 5)

  const maxPrecipitation = await db
    .collection("readings")
    .find({
      "deviceName": deviceName,
      time: { $gte: lastFiveMonths },
    })
    .sort({ precipitation: -1 })
    .project({
      "deviceName": 1,
      "time": 1,
      "precipitation": 1,
      _id: 0,
    })
    .limit(1).next();

  if (maxPrecipitation) {
    return maxPrecipitation
  } else {
    return Promise.reject(
      "Maximum precipitation not found in the last 5 months for the specified device."
    )
  }
}

/**
 * Get temperature, atmospheric, radiation and precipitation spacific station(device) by given date time
 *
 * @param {String} deviceName - The spacific station name
 * @param {Date} datetime - Date time
 * @returns {Promise<Object>} - A promise for the matching reading
 */
export async function getDeviceByDate(deviceName, datetime) {
  // Convert the dateTime string to a Date object
  const dateAndTime = new Date(datetime)

  const reading = await db
    .collection("readings")
    .find({ "deviceName": deviceName, time: { $gte: dateAndTime} })
    .project({
      "temperature": 1,
      "atmosphericPressure": 1,
      "solarRadiation": 1,
      "precipitation": 1,
      _id: 0
    })
    .limit(1).next()

  if (reading) {
    return reading
  } else {
    return Promise.reject("Not found specific station by given date")
  }
}

/**
 * Get maximum temperature for all stations by date range(start and end date)
 *
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {Promise<Array>} - A promise resolves with an array for maximum temperature
 */
export async function getMaxTempByDateRange(startDate, endDate) {
  // Convert the start and end date strings to Date objects
  const start = new Date(startDate)
  const end = new Date(endDate)

  const maxTemperature = await db
  .collection("readings")
  .aggregate([
    { $match: { time: { $gte: start, $lte: end } } },
    { $sort: { "temperature": -1 } },
    {
      $group: {
        "_id": "$deviceName",
        "temperature": { $max: "$temperature" },
        "time": { $first: "$time" },
      },
    },
    {
      $project: {
        "_id": 0, 
        "deviceName": "$_id", 
        "temperature": 1,
        "time": 1,
      }
    }
  ]).toArray()

  if (maxTemperature) {
    return maxTemperature
  } else {
    return Promise.reject(
      "Maximum temperature not found within the specified date range."
    )
  }
}

/**
 * Update a specified precipitation value to a specific value
 *
 * @param {ObjectId} id - mongoDB objectId for update
 * @param {Number} precipitation - The new precipitation value to set
 * @returns {Promise<UpdateOneResult>} - The result of the update operation
 */
export async function updatePrecipById(id, precipitation) {
  return db
    .collection("readings")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { "precipitation": precipitation } }
    )
}
