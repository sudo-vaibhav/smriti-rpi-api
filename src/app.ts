import express from 'express';
const app = express();

import morgan from 'morgan';
app.use(morgan('dev'));

import cors from 'cors';
app.use(cors());

import dotenv from 'dotenv';
dotenv.config();

import bodyParser from 'body-parser';
app.use(bodyParser.json({}));

import router from './routes';
app.use('/', router);

import errorHandler from './helpers/errorHandler';
app.use(errorHandler);

export default app;
