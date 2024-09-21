import express from "express"
import authRouter from"./routes/auth.js"
import readingsRouter from"./routes/readings.js"
import userRouter from"./routes/users.js"
import docs from "./middleware/docs.js"
import cors from "cors"

// Create express application instance
const app = express()
const port = 8080

//CORS middleware
app.use(cors({
    origin: ["http://localhost:8080", "https://www.test-cors.org"],
}))


// Enable JSON request body parsing middleware (turns JSON into JS objects)
app.use(express.json())

//Routes
app.use(docs)
app.use("/readings", readingsRouter)
app.use("/auth", authRouter)
app.use("/users", userRouter)


// Handle errors raised by endpoint and respond with JSON error object
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status,
        message: err.message,
        errors: err.errors
    })
})

// Listening for requests
app.listen(port, () => {
    console.log("Express started on http://localhost:" + port)
})