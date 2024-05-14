import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import {ActiveConnections, Coordinate, IncomingCoordinate} from "./types";

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());

const router = express.Router();

const activeConnections: ActiveConnections = {};
let coordinates: Coordinate[] = [];

router.ws('/paint', (ws) => {
    const id = crypto.randomUUID();
    console.log(`client connected! id - ${id}`);

    activeConnections[id] = ws;
    activeConnections[id].send(JSON.stringify({type: 'ALL_COORDINATES', payload: coordinates}));
    ws.send(JSON.stringify({type: 'WELCOME', payload: 'Hello you are connected to print service'}));

    ws.send(JSON.stringify({type: 'NEW_USER', payload: coordinates}));

    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message.toString()) as IncomingCoordinate;
        if (parsedMessage.type === 'COORDINATES') {
            Object.values(activeConnections).forEach((connection) => {
                const outgoingMessage = {type: 'NEW_COORDINATES', payload: parsedMessage.payload};
                coordinates.push(parsedMessage.payload);
                connection.send(JSON.stringify(outgoingMessage));
            })
        }
        if (parsedMessage.type === 'NEW_USER') {
            ws.send(JSON.stringify({type: 'ALL_COORDINATE', payload: coordinates}));
        }
        if (parsedMessage.type === 'REFRESH') {
            coordinates = [];
            Object.values(activeConnections).forEach((connection) => {
                const outgoingMessage = {type: 'REFRESH'};
                coordinates.push(parsedMessage.payload);
                connection.send(JSON.stringify(outgoingMessage));
            })
        }
    });

    ws.on('close', () => {
        console.log(`client disconnected. id - ${id}`);
        delete activeConnections[id];
        if (Object.keys(activeConnections).length === 0) coordinates = [];
    });
});

app.use(router);

app.listen(port, () => {
    console.log(`server running on ${port} port.`);
});