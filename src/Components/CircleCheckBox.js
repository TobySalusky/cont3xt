export function CircleCheckBox({onClick, filled}) {
	return (
		<div style={{
			width: 6,
			height: 6,
			border: '1px solid white',
			borderRadius: '50%',
			backgroundColor: !filled ? 'none' : 'white'
		}}/>
	);
}
