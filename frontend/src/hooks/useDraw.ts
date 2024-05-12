import {useEffect, useRef, useState} from 'react';

export const useDraw = (onDraw: ({context, currentPoint, prevPoint}: Draw) => void) => {
    const [mouseDown, setMouseDown] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const prevPoint = useRef<Point | null>(null);

    const onMouseDown = () => setMouseDown(true);
    const onMouseUp = () => {
        setMouseDown(false);
        prevPoint.current = null;
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        context?.clearRect(0, 0, canvas.width, canvas.height);
    };

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!mouseDown) return;
            const currentPoint = computePointOnCanvas(e);
            const context = canvasRef.current?.getContext('2d');
            if (!context || !currentPoint) return;

            onDraw({context, currentPoint, prevPoint: prevPoint.current});
            prevPoint.current = currentPoint;
        };

        const computePointOnCanvas = (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            return {x, y};
        };

        canvasRef.current?.addEventListener('mousemove', handler);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            canvasRef.current?.removeEventListener('mousemove', handler);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [mouseDown, onDraw]);

    return {canvasRef, onMouseDown, clear};
};