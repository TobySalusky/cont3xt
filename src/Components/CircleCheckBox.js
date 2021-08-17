export function CircleCheckBox({onClick = undefined, filled, color = 'white'}) {
	return (
		<div onClick={onClick} style={{
			width: 6,
			height: 6,
			border: `1px solid ${color}`,
			borderRadius: '50%',
			backgroundColor: filled === true ? color : null,
		}}/>
	);
}
