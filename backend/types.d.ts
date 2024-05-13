import {WebSocket} from 'ws';

export interface ActiveConnections {
    [id: string]: WebSocket
}

export interface IncomingCoordinate {
    type: string;
    payload: Coordinate;
}

type Coordinate = {
    x: number;
    y: number;
    color: string;
}