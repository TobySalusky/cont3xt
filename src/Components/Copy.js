import '../Style/App.css';
import { whiteFilter } from "../Util/Filters";

export function Copy({value, style}) {
	return (
		<img style={{...style/*, ...whiteFilter*/}} className="ExternalLink" src="./images/copy.svg" alt="copy"
		     onClick={() => navigator.clipboard.writeText(value)}
		/>
	);
}
