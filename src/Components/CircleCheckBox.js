export function CircleCheckBox({onClick, filled}) {
	return (
		<div style={{
			width: 10,
			aspectRatio: 1,
			border: '1px solid white',
			backgroundColor: filled ? 'none' : 'white'; 
		}}/>
	);
}
