import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// const PORT = 5555;

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
