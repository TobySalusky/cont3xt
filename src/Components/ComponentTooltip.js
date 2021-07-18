import React, {useState, useRef} from 'react';
import Portal from './Portal';
import styled from 'styled-components';


const StyledTooltip = styled.span`
  position: absolute;
  left: ${(p) => p.pos.x}px;
  top: ${(p) => p.pos.y}px;

  transform: translateX(-50%) scale(${(p) => p.show ? 1 : 0});
  opacity: ${(p) => p.show ? 1 : 0};

  transition-property: transform, opacity !important;
  transition-duration: ${(p) => !p.show ? 0.2 : 0.1}s !important;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1) !important;
  transition-delay: ${(p) => (!p.show && p.interactive) ? 0.1 : 0}s;
  transform-origin: top center;

  --shadow-color: ${(p) => p.shadowColor};
  filter: drop-shadow(${(p) => p.shadowOff}px ${(p) => p.shadowOff}px ${(p) => p.shadowBlur}px var(--shadow-color))
  drop-shadow(-${(p) => p.shadowOff}px ${(p) => p.shadowOff}px ${(p) => p.shadowBlur}px var(--shadow-color))
  drop-shadow(${(p) => p.shadowOff}px -${(p) => p.shadowOff}px ${(p) => p.shadowBlur}px var(--shadow-color))
  drop-shadow(-${(p) => p.shadowOff}px -${(p) => p.shadowOff}px ${(p) => p.shadowBlur}px var(--shadow-color));
`;
//  height: 1000px;
//   overflow-y: auto;

const findPos = (el, dir = 'bottom', space = 10) => {
	
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

export default function ComponentTooltip({comp, noInteract, noShadow, children, style, ...props}) {
	
	const [show, setShow] = useState(false)
	const posRef = useRef({x: 0, y: 0})
	
	const handleOver = (e) => {
		setShow(true)
		posRef.current = findPos(e.currentTarget)
	}
	
	const handleOut = () => {
		setShow(false)
	}
	
	return (
		<div style={style}>
			{React.cloneElement(children, {
				onMouseOver: handleOver,
				onMouseOut: handleOut,
			})}
			
			<Portal>
				<StyledTooltip pos={posRef.current} show={show} interactive={!noInteract} onMouseOver={() => {
					if (!noInteract) setShow(true)
				}} onMouseOut={handleOut} shadowColor={noShadow ? 'transparent' : 'rgba(0, 0, 0, 0.5)'} shadowOff={5} shadowBlur={5}>
					{comp}
				</StyledTooltip>
			</Portal>
		</div>
	);
}
