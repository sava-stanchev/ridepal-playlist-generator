import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import deezerServices from './service/deezerServices.js';

import dotenv from 'dotenv';

// const PORT = 5555;
const config = dotenv.config().parsed;
const PORT = config.PORT;

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

const a = deezerServices.mainGenres();
console.log('index');
setTimeout(() => console.log(a), 3000);

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
