import '../Style/App.css';
import { whiteFilter } from "../Util/Filters";
import React from "react";

export const Copy : React.FC<{
	value: string,
	style? : any
}> = ({value, style}) => {
	return (
		<img style={style} className="ExternalLink" src="./images/copy.svg" alt="copy"
		     onClick={() => navigator.clipboard.writeText(value)}
		/>
	);
}
