import { Copy } from "./Copy";
import { whiteFilter } from "../Util/Filters";
import React from "react";

export const TooltipCopy : React.FC<{
	value? : string,
	valueFunc? : ()=>string,
}> = ({value, valueFunc}) => {

	return (
		<span className="TooltipCopyBody"
		      onClick={valueFunc != null ? () => navigator.clipboard.writeText(valueFunc()) : () => navigator.clipboard.writeText(String(value))}
		>
            <Copy value={String(value)} style={{...whiteFilter, userSelect: 'none'}}/>
        </span>
	);
}
