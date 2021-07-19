import { Copy } from "./Copy";
import { whiteFilter } from "../Util/Filters";

export const TooltipCopy = ({value}) => {
	
	return (
		<span className="TooltipCopyBody"
		      onClick={() => navigator.clipboard.writeText(value)}
		>
            <Copy value={value} style={{...whiteFilter, userSelect: 'none'}}/>
        </span>
	);
}
