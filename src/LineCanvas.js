import './App.css';
import { useRef, useEffect, useLayoutEffect } from 'react';


export default function LineCanvas(props) {

    const canvasRef = useRef(null)

    const drawLine = (ctx, from, to) => {

        const mid = {x:from.x, y: Math.max(from.y, to.y - 50)}

        ctx.beginPath()
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(mid.x, mid.y)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(mid.x, mid.y);
        ctx.bezierCurveTo(mid.x, to.y, mid.x, to.y, to.x, to.y)
        ctx.stroke()
    }

    useLayoutEffect(() => {
        console.log('TRIGGERED')
        if (props.dnsRefs.current.length === 0 || props.dnsRefs.current.some(val => val !== null)) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')

            ctx.strokeStyle = 'lightgray'

            const mainRect = props.resultBoxRef.current.getBoundingClientRect()
            const start = {x: mainRect.x+20, y: mainRect.y+mainRect.height}

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const div of props.dnsRefs.current) {
                const rect = div.getBoundingClientRect()
                drawLine(ctx, start, {x: rect.x, y: rect.y + rect.height/2})
            }

        }

    }, [props.dnsRefs.current])

    return (
        <div>
            <canvas width={1920} height={1080} className="LineCanvas" ref={canvasRef} {...props}/>
            {props.children}
        </div>
    );
}
