import { Copy } from "./Copy";
import { whiteFilter } from "../Util/Filters";

export const TooltipCopy = ({value, valueFunc}) => {
	
	return (
		<span className="TooltipCopyBody"
		      onClick={valueFunc != null ? () => navigator.clipboard.writeText(valueFunc()) : () => navigator.clipboard.writeText(value)}
		>
            <Copy value={value} style={{...whiteFilter, userSelect: 'none'}}/>
        </span>
	);
}
