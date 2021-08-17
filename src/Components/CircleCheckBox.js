export function CircleCheckBox({onClick = undefined, filled}) {
	return (
		<div onClick={onClick} style={{
			width: 6,
			height: 6,
			border: '1px solid white',
			borderRadius: '50%',
			backgroundColor: filled === true ? 'white' : null,
		}}/>
	);
}
