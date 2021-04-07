import './App.css';
import { useRef, useEffect } from 'react';


export default function LineCanvas(props) {

    const canvasRef = useRef(null)

    const drawLine = (ctx, from, to) => {
        ctx.beginPath()
        ctx.moveTo(from.x, from.y);
        ctx.bezierCurveTo(from.x, to.y, from.x, to.y, to.x, to.y)
        ctx.stroke()
    }

    useEffect(() => { // TODO: make sure to have some padding (if points are on edge, thickness is skewed)

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        ctx.strokeStyle = '#FFFFFF'
        const start = {x: 10, y: 10}

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLine(ctx, start, {x:90, y:90})


    }, [])

    return (
        <canvas ref={canvasRef} {...props}/>
    );
}
