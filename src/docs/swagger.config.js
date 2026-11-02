import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions= {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "shipnow",
            version: "1.0.0",
            description: "documentacion de shipnow: usuarios, mocks"
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "servidor local"
            }
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth:{
                    type: "apiKey",
                    in: "header",
                    name: "x-api-key"
                }
            }
        },
        security: [{ApiKeyAuth:[]}]
    },
    apis: ['./src/docs/**/*.yaml', './src/routes/*.js']
}

const swaggerSpecs = swaggerJSDoc(swaggerOptions)

export default swaggerSpecs