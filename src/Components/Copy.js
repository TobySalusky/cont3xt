import '../Style/App.css';

export function Copy({value, style}) {
	
	return (
		<img style={style} className="ExternalLink" src="./images/copy.svg" alt="copy"
		     onClick={() => navigator.clipboard.writeText(value)}
		/>
	);
}
