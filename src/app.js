import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import './db.js';
import configObject from "./config/general.config.js";
import usersRouter from './routes/users.routes.js';
import petsRouter from './routes/pets.routes.js';
import adoptionsRouter from './routes/adoption.routes.js';
import sessionsRouter from './routes/sessions.routes.js';
import mocksRouter from './routes/mocks.routes.js';

const app = express();
const { PORT } = configObject || 8080;
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Pet Adoption API",
      version: "1.0.0",
      description: "A simple Express Library API",
    }
  },
  apis: ["./src/docs/**/*.yaml"]
};
const specs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use("/api/mocks", mocksRouter);

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
