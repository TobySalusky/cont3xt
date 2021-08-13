import '../Style/App.css';
import LineElement from "./LineElement";
import { colorTable } from '../Util/Colors';

export default function ValidationBox({status, banner}) {
	
	const statusTable = {
		'err': ['Error During Validation', colorTable.error],
		false: ['Possibly Invalid', colorTable.error],
		true: ['Valid', colorTable.successGreen]
	}
	
	return (
		<div className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, paddingBlock: 2, fontSize: 12}}>
			<p style={{fontWeight: 'bolder', color: statusTable[status][1]}}>{statusTable[status][0]}</p>
			{!banner || <p style={{marginLeft: 5}}>{'| '}{banner}</p>}
		</div>
	);
}

