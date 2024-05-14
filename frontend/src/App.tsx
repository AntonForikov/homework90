import './App.css';
import {ChromePicker} from 'react-color';
import {useCallback, useEffect, useRef, useState} from "react";
import * as React from "react";

function App() {
    const [color, setColor] = useState('#000');
    const [coordinates, setCoordinates] = useState<Coordinates[]>([]);

    const ws = useRef<WebSocket | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const clear = () => {
        // const canvas = canvasRef.current;
        // if (!canvas) return;
        // const context = canvas.getContext('2d');
        // context?.clearRect(0, 0, canvas.width, canvas.height);
        ws.current?.send(JSON.stringify({type: 'REFRESH'}));
    };

    useEffect(() => {
        ws.current = new WebSocket('ws://127.0.0.1:8000/paint');
        ws.current?.addEventListener('close', () => console.log('Connection closed'));

        ws.current?.addEventListener('message', (msg) => {
            const parsed = JSON.parse(msg.data);
            if (parsed.type === 'NEW_COORDINATES') {
                setCoordinates((prevState) => [...prevState, parsed.payload]);
            }
            if (parsed.type === 'ALL_COORDINATES') {
                setCoordinates(parsed.payload);
            }
            if (parsed.type === 'WELCOME') {
                console.log(parsed.payload);
            }
            if (parsed.type === 'REFRESH') {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const context = canvas.getContext('2d');
                context?.clearRect(0, 0, canvas.width, canvas.height);
                setCoordinates([]);
            }
        });
        return () => {
            if (ws.current) ws.current?.close();
        };
    }, []);

    const setCircles = useCallback(() => {
        if (coordinates.length > 0) coordinates.forEach((coordinate) => {
            if (coordinate) circle(coordinate.x, coordinate.y, coordinate.color);
        });
    }, [coordinates]);

    useEffect(() => {
        setCircles();
    }, [setCircles]);

    const coordinatesToSend = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (!ws.current) return;
            ws.current?.send(JSON.stringify({type: 'COORDINATES', payload: {x, y, color}}));
        }
    };

    const circle = (x: number, y: number, color: string) => {
        const context = canvasRef.current?.getContext('2d');
        if (context && canvasRef.current) {
            context.beginPath();
            context.lineWidth = 3;
            context.strokeStyle = color;
            context.arc(x, y, 10, 0, 2 * Math.PI);
            context.stroke();
        }
    };

    return (
        <div
            style={{display: 'flex', alignItems: 'center'}}
        >
            <div>
                <ChromePicker color={color} onChange={(e) => setColor(e.hex)}/>
                <button
                    style={{marginTop: 15}}
                    onClick={clear}
                >
                    Clear
                </button>
            </div>
            <canvas
                width={750}
                height={750}
                style={{border: '1px solid black', borderRadius: 7, marginLeft: 20}}
                ref={canvasRef}
                onMouseDown={coordinatesToSend}
            />
        </div>
    );
}

export default App;
