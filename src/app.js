import express from 'express';
import cookieParser from 'cookie-parser';

import './db.js';
import configObject from "./config/general.config.js";
import usersRouter from './routes/users.routes.js';
import petsRouter from './routes/pets.routes.js';
import adoptionsRouter from './routes/adoption.routes.js';
import sessionsRouter from './routes/sessions.routes.js';
import mocksRouter from './routes/mocks.routes.js'

const app = express();
const { PORT } = configObject || 8080;

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use("/api/mocks", mocksRouter);

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
