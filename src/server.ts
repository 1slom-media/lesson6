import cors from 'cors';
import express, { Application } from 'express';
import { AppDataSource } from './data-source';
import bodyParser from 'body-parser';
import router from './routes';
import createMQConsumer from './cunsomer';


const app: Application = express();

const PORT = process.env.PORT || 8080



app.use(express.json());
app.use(bodyParser.json())
app.use(cors())
AppDataSource.initialize().then((): void => console.log("connected")).catch((err: unknown): void => console.log(err));
app.use(router)
const AMQP_URL = "amqp://localhost"
const QUEUE_NAME = "eventqueue"
const consumer = createMQConsumer(AMQP_URL, QUEUE_NAME)
consumer()




app.listen(PORT, (): void => console.log(`http://localhost:${PORT}`));