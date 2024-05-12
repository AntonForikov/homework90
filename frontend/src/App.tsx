import './App.css';
import {useDraw} from "./hooks/useDraw.ts";
import {ChromePicker} from 'react-color';
import {useState} from "react";

function App() {
    //
    // const draw =({nativeEvent}: React.MouseEvent) => {
    //     if (!isDrawing) return;
    //     const {offsetX, offsetY} = nativeEvent;
    //     console.log({x: offsetX, y: offsetY});
    //     contextRef.current?.lineTo(offsetX, offsetY);
    //     contextRef.current?.stroke();
    // };
    const [color, setColor] = useState('#000');

    const drawLine = ({prevPoint, currentPoint, context}: Draw) => {
        const {x: currX, y: currY} = currentPoint;
        const lineWidth = 5;

        const startPoint = prevPoint ?? currentPoint;
        context.beginPath();
        context.lineWidth = lineWidth;
        context.strokeStyle = color;
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(currX, currY);
        context.stroke();

        context.fillStyle = color;
        context.beginPath();
        context.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
        context.fill();
    };

    const { canvasRef, onMouseDown, clear} = useDraw(drawLine);

    return (

        <div
            style={{display: 'flex', alignItems: 'center'}}
        >
            <div>
                <ChromePicker color={color} onChange={(e) => setColor(e.hex)}/>
                <button onClick={clear} style={{marginTop: 10}}>Clear</button>
            </div>
            <canvas
                width={750}
                height={750}
                style={{border: '1px solid black', borderRadius: 7, marginLeft: 20}}
                ref={canvasRef}
                onMouseDown={onMouseDown}
            />
        </div>
    )
        ;
}

export default App;
