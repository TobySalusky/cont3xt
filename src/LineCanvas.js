import './App.css';
import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import {useWindowDimen} from './ResizeUtil'


export default function LineCanvas(props) {

    const canvasRef = useRef(null)
    const dimen = useRef({minX: Number.MAX_VALUE, minY: Number.MAX_VALUE, maxX: Number.MIN_VALUE, maxY: Number.MIN_VALUE})

    const windowDimen = useWindowDimen()

    const {topRefs, subRefs} = props.refData;

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

        try {
            for (let i = 0; i < topRefs.current.length; i++) {
                const mainRect = topRefs.current[i].getBoundingClientRect()
                edit(mainRect)

                for (const div of subRefs.current[i]) {
                    if (topRefs.current[i] !== null && div !== null) {

                        const rect = div.getBoundingClientRect()
                        edit(rect)
                    }
                }
            }
        } catch (e) {
            console.log('err catch')
            minX = Number.MAX_VALUE
            minY = Number.MAX_VALUE
            maxX = Number.MIN_VALUE
            maxY = Number.MIN_VALUE
        } // TODO: rewrite so this isn't a thing

        return {minX, minY, maxX, maxY}
    }

    const getWidth = () => dimen.current.maxX - dimen.current.minX;
    const getHeight = () => dimen.current.maxY - dimen.current.minY;

    useLayoutEffect(() => {
        if (subRefs.current.length === 0 || subRefs.current.some(val => val !== null)) { // TODO: fix culling statement!
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')

            ctx.strokeStyle = 'lightgray'

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let newDimen = genDimens()
            if (newDimen !== dimen.current) {
                dimen.current = newDimen
            }

            try {
                for (let i = 0; i < topRefs.current.length; i++) {

                    const mainRect = topRefs.current[i].getBoundingClientRect()
                    const leftStart = {x: mainRect.x+20, y: mainRect.y+mainRect.height}
                    const rightStart = {x:mainRect.x + mainRect.width, y: mainRect.y + mainRect.height/2}

                    for (const div of subRefs.current[i]) {
                        if (topRefs.current[i] !== null && div !== null) {

                            const rect = div.getBoundingClientRect()
                            if (rect.x > mainRect.x + mainRect.width) {
                                drawLineRight(ctx, rightStart, {x: rect.x, y: rect.y + rect.height/2})
                            } else {
                                drawLineUnder(ctx, leftStart, {x: rect.x, y: rect.y + rect.height/2})
                            }
                        }
                    }
                }
            } catch (e) {} // TODO: rewrite so this isn't a thing
        }

    }, [subRefs.current, windowDimen])

    return (
        <div>
            <canvas width={getWidth()} height={getHeight()} className="LineCanvas" style={{top: dimen.current.minY, left: dimen.current.minX}} ref={canvasRef} {...props}/>
            {props.children}
        </div>
    );
}
