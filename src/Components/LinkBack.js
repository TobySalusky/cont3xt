import '../Style/App.css';

export function LinkBack({url, query, style}) {

	if (!url && query) {
		url = `/?q=${query}`;
	}
	
	return (
		<img style={style} className="ExternalLink" src="./images/externalLink.svg" alt="external link"
		     onClick={() => window.open(url, '_blank', 'noreferrer')}
		/>
	);
}
