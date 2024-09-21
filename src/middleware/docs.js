import { Router } from "express"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import * as OpenApiValidator from "express-openapi-validator"

const docs = Router()

// Setup swaggerJSDoc - It will read our code comments and generate and OpenAPI specification file for all of our routes.
const options = {
    failOnErrors: true,
    definition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "Weather Data API",
            description: "JSON REST API for tracking weather data readings"
        },
        components: {
            securitySchemes: {
                ApiKey: {
                    type: "apiKey",
                    in: "header",
                    name: "X-AUTH-KEY"
                }
            }
        }
    },
    apis: ["./src/routes/*.{js,yaml}", "./src/middleware/docs.js", "./src/components.yaml"]
}

const specification = swaggerJSDoc(options)

// Setup SwaggerUI - This will serve an interactive webpage that documents our API based on the specification generated above.
/**
 * @openapi
 * /docs:
 *      get:
 *          summary: "View automatically generated API documentation"
 *          responses:
 *              '200':
 *                  description: "Swagger documentation page"
 */
docs.use("/docs", swaggerUi.serve, swaggerUi.setup(specification))

// Setup OpenAPIValidator - This will automatically check that every route adheres to the documentation
//(i.e. will validate every request and response)
docs.use(
    OpenApiValidator.middleware({
        apiSpec: specification,
        validateRequests: true,
        validateResponses: true,
    })
)

export default docs