import { Copy } from "./Copy";
import { whiteFilter } from "../Util/Filters";

export const TooltipCopy = ({value}) => {
	
	return (
		<span style={{display: 'flex', flexDirection: 'row', justifyContent: 'flexEnd', width: '100%', marginBottom: 3}}>
            <Copy value={value} style={whiteFilter}/>
        </span>
	);
}
