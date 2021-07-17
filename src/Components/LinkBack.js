import '../Style/App.css';
import { whiteFilter } from "../Util/Filters";

export function LinkBack({url, query, style}) {

	if (!url && query) {
		url = `/?q=${query}`;
	}
	
	return (
		<img style={{...style/*, ...whiteFilter*/}} className="ExternalLink" src="./images/externalLink.svg" alt="external link"
		     onClick={() => window.open(url, '_blank', 'noreferrer')}
		/>
	);
}
