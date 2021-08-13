import '../Style/App.css';
import React, { useRef, useState, useLayoutEffect, useContext } from 'react';
import {useWindowDimen} from '../Util/ResizeUtil'
import {LineContext} from "../State/LineContext";
import { MutationContext } from '../State/MutationContext';
import { MutationUtil } from './ChildMutationObserver';


export default function LineCanvas(props) {

    const canvasRef = useRef(null);
    const [mutationCount,] = useContext(MutationContext);
    const dimen = useRef({minX: Number.MAX_VALUE, minY: Number.MAX_VALUE, maxX: Number.MIN_VALUE, maxY: Number.MIN_VALUE})

    const windowDimen = useWindowDimen()

    const [lineRefs, setLineRefs] = useState({})

    const drawLineUnder = (ctx, from, to) => {

        const mid = {x:from.x, y: Math.max(from.y, to.y - 50)}

        const mixX = dimen.current.minX
        const minY = dimen.current.minY

        ctx.beginPath()
        ctx.moveTo(from.x - mixX, from.y - minY);
        ctx.lineTo(mid.x - mixX, mid.y - minY)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(mid.x - mixX, mid.y - minY);
        ctx.bezierCurveTo(mid.x - mixX, to.y - minY, mid.x - mixX, to.y - minY, to.x - mixX, to.y - minY)
        ctx.stroke()
    }

    const drawLineRight = (ctx, from, to) => {

        const mid = {x:(from.x + to.x) / 2, y: (from.y + to.y) / 2}

        const mixX = dimen.current.minX
        const minY = dimen.current.minY

        ctx.beginPath()
        ctx.moveTo(from.x - mixX, from.y - minY);
        ctx.bezierCurveTo((mid.x + from.x) / 2 - mixX, from.y - minY, (mid.x + from.x) / 2 - mixX, from.y - minY, mid.x - mixX, mid.y - minY)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(mid.x - mixX, mid.y - minY);
        ctx.bezierCurveTo((mid.x + to.x) / 2 - mixX, to.y - minY, (mid.x + to.x) / 2 - mixX, to.y - minY, to.x - mixX, to.y - minY)
        ctx.stroke()
    }

    const genDimens = () => { // min values currently clamped to (0,0) // TODO: (change?)

        let minX = 0, minY = 0, maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;

        const edit = (rect) => {
            minX = Math.min(minX, rect.x - 5)
            minY = Math.min(minY, rect.y - 5)
            maxX = Math.max(maxX, rect.x + rect.width + 5)
            maxY = Math.max(maxY, rect.y + rect.height + 5)
        }

        for (const lineID of Object.keys(lineRefs)) {

            const entry = lineRefs[lineID]
            if (entry && entry.ref) {
                const rect = entry.ref.getBoundingClientRect()
                edit(rect)
            }
        }

        return {minX, minY, maxX, maxY}
    }

    const getWidth = () => dimen.current.maxX - dimen.current.minX;
    const getHeight = () => dimen.current.maxY - dimen.current.minY;

    useLayoutEffect(() => {
        
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        ctx.strokeStyle = 'lightgray'

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let newDimen = genDimens()
        if (newDimen !== dimen.current) {
            dimen.current = newDimen
        }

        drawLines(ctx);
    }, [lineRefs, windowDimen, mutationCount, MutationUtil.mutationCount])

    const drawLines = (ctx) => {
        for (const lineID of Object.keys(lineRefs)) {

            const entry = lineRefs[lineID]
            if (entry && entry.lineFrom) {
                const toRef = entry.ref

                const fromEntry = lineRefs[entry.lineFrom]
                const fromRef = (fromEntry) ? fromEntry.ref : undefined;

                if (fromRef && toRef) {
                    drawLineBetweenRefs(ctx, fromRef, toRef)
                }
            }
        }
    }

    const drawLineBetweenRefs = (ctx, fromRef, toRef) => {

        const fromRect = fromRef.getBoundingClientRect()
        const rect = toRef.getBoundingClientRect()

        let start;
        if (rect.x > fromRect.x + fromRect.width) {
            start = {x: fromRect.x + fromRect.width, y: fromRect.y + fromRect.height/2}
            drawLineRight(ctx, start, {x: rect.x, y: rect.y + rect.height/2})
        } else {
            start = {x: fromRect.x+20, y: fromRect.y+fromRect.height}
            drawLineUnder(ctx, start, {x: rect.x, y: rect.y + rect.height/2})
        }
    }

    return (
        <LineContext.Provider value={[lineRefs, setLineRefs]}>
            <canvas width={getWidth()} height={getHeight()} className="LineCanvas" style={{top: dimen.current.minY, left: dimen.current.minX/*, backgroundColor: '#FF000033'*/, position: 'absolute'}} ref={canvasRef} {...props}/>
            {props.children}
        </LineContext.Provider>
    );
}
