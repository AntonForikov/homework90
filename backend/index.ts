import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import {ActiveConnections, IncomingMessage} from "./types";

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());

const router = express.Router();

const activeConnections: ActiveConnections = {}

router.ws('/paint', (ws, req) => {
    const id = crypto.randomUUID();
    console.log(`client connected! id - ${id}`);
    activeConnections[id] = ws;
    let username = 'Anonymous';

    ws.send(JSON.stringify({type: 'WELCOME', payload: 'Hello you are connected to print service'}));

    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message.toString()) as IncomingMessage;
        if (parsedMessage.type === 'SET_USERNAME') {
            username = parsedMessage.payload;
        } else if (parsedMessage.type === 'SEND_MESSAGE') {
            Object.values(activeConnections).forEach((connection) => {
                const outgoingMessage = {type: 'NEW_MESSAGE', payload: {username, text: parsedMessage.payload}};
                connection.send(JSON.stringify(outgoingMessage));
            })
        }
    });

    ws.on('close', () => {
        console.log(`client disconnected. id - ${id}`);
        delete activeConnections[id];
    });
});

app.use(router);

app.listen(port, () => {
    console.log(`server running on ${port} port.`);
});