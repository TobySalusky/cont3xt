import './App.css';
import { useRef, useEffect, useLayoutEffect } from 'react';
import {useWindowDimen} from './ResizeUtil'


export default function LineCanvas(props) {

    const canvasRef = useRef(null)

    const windowDimen = useWindowDimen()

    const {refIndex, refStack, topRefs, subRefs} = props.refData;

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
        if (subRefs.current.length === 0 || subRefs.current.some(val => val !== null)) { // TODO: fix culling statement!
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')

            ctx.strokeStyle = 'lightgray'

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            try {
                for (let i = 0; i < topRefs.current.length; i++) {
                    for (const div of subRefs.current[i]) {
                        if (topRefs.current[i] !== null && div !== null) {
                            const mainRect = topRefs.current[i].getBoundingClientRect()
                            const start = {x: mainRect.x+20, y: mainRect.y+mainRect.height}

                            const rect = div.getBoundingClientRect()
                            drawLine(ctx, start, {x: rect.x, y: rect.y + rect.height/2})
                        }
                    }
                }
            } catch (e) {} // TODO: rewrite so this isn't a thing
        }

    }, [subRefs.current, windowDimen])

    return (
        <div>
            <canvas width={1920} height={1080} className="LineCanvas" ref={canvasRef} {...props}/>
            {props.children}
        </div>
    );
}
