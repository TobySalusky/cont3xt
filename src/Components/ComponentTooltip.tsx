import React, {useState, useRef} from 'react';
import Portal from './Portal';
// @ts-ignore
import styled from 'styled-components';
import {Vector2} from "../Types/Types";

type P = {
	pos : Vector2;
	show : boolean;
	interactive : boolean;
	shadowColor : any;
	shadowOff : any;
	shadowBlur : any;
	zIndex : number;
};

const StyledTooltip = styled.span`
  position: absolute;
  left: ${(p:P) => p.pos.x}px;
  top: ${(p:P) => p.pos.y}px;

  transform: translateX(-50%) scale(${(p:P) => p.show ? 1 : 0});
  opacity: ${(p:P) => p.show ? 1 : 0};

  transition-property: transform, opacity !important;
  transition-duration: ${(p:P) => !p.show ? 0.2 : 0.1}s !important;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1) !important;
  transition-delay: ${(p:P) => (!p.show && p.interactive) ? 0.1 : 0}s;
  transform-origin: top center;

  --shadow-color: ${(p:P) => p.shadowColor};
  filter: drop-shadow(${(p:P) => p.shadowOff}px ${(p:P) => p.shadowOff}px ${(p:P) => p.shadowBlur}px var(--shadow-color))
  drop-shadow(-${(p:P) => p.shadowOff}px ${(p:P) => p.shadowOff}px ${(p:P) => p.shadowBlur}px var(--shadow-color))
  drop-shadow(${(p:P) => p.shadowOff}px -${(p:P) => p.shadowOff}px ${(p:P) => p.shadowBlur}px var(--shadow-color))
  drop-shadow(-${(p:P) => p.shadowOff}px -${(p:P) => p.shadowOff}px ${(p:P) => p.shadowBlur}px var(--shadow-color));

	z-index: ${(p:P) => p.zIndex};
`;
//  height: 1000px;
//   overflow-y: auto;

const findPos = (el : any, dir = 'bottom', space = 10) => {
	
	const elRect = el.getBoundingClientRect();
	const pos = {x: 0, y: 0}
	switch (dir) {
		case 'bottom':
			pos.x = elRect.x + elRect.width / 2
			pos.y = elRect.bottom + space
			break;
	}
	
	return pos
}

const ComponentTooltip : React.FC<{
	comp : any;
	noInteract? : boolean;
	zIndex? : number;
	noShadow? : boolean;
	style? : any
}> = ({comp, noInteract, zIndex = 1, noShadow, children, style, ...props}) => {
	
	const [show, setShow] = useState(false)
	const posRef = useRef({x: 0, y: 0})
	
	const handleOver = (e : any) => {
		setShow(true)
		posRef.current = findPos(e.currentTarget)
	}
	
	const handleOut = () => {
		setShow(false)
	}

	const tempChildren : any = children; // TODO: figure out how typescript works please

	return (
		<div style={style}>
			{React.cloneElement(tempChildren, {
				onMouseOver: handleOver,
				onMouseOut: handleOut,
			})}

			<Portal>
				<StyledTooltip zIndex={zIndex} pos={posRef.current} show={show} interactive={!noInteract} onMouseOver={() => {
					if (!noInteract) setShow(true)
				}} onMouseOut={handleOut} shadowColor={noShadow ? 'transparent' : 'rgba(0, 0, 0, 0.5)'} shadowOff={5} shadowBlur={5}>
					{comp}
				</StyledTooltip>
			</Portal>
		</div>
	);
}
export default ComponentTooltip;