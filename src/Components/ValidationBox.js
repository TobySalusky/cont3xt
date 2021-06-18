import '../App.css';
import LineElement from "../LineElement";
import { colorTable } from '../Util/Colors';

export default function ValidationBox({status}) {
	
	const statusTable = {
		'err': ['Error During Validation', colorTable.error],
		false: ['Invalid', colorTable.error],
		true: ['Valid', colorTable.successGreen]
	}
	
	return (
		<div>
			{(status === undefined) ? null :
				<LineElement lineID="validation" lineFrom="main" style={{marginLeft: 40, marginBottom: 5}}>
					<div className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, fontSize: 12}}>
						<p style={{fontWeight: 'bolder', color: statusTable[status][1]}}>{statusTable[status][0]}</p>
					</div>
				</LineElement>
			}
		</div>
	);
}

