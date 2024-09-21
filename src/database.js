import { MongoClient } from "mongodb";
import * as dotenv from "dotenv"

// Setup ENV file values in process
dotenv.config()

// Access the mongodb connection URL from the ENV
const connectionString = process.env.MDBURL

// Create a new mongodb client with the url from env file
const client = new MongoClient(connectionString)

//Select the database to use and export for use by models
export const db = client.db("weather_data")

