import { useContext } from 'react';
import {LineContext} from "../State/LineContext";

function LineElement ({lineID = undefined, lineFrom= undefined, children= undefined, style= undefined}) {

    const [lineRefs] = useContext(LineContext)

    const setRef = (el) => {
        const dict = {ref: el}
        if (lineFrom) dict.lineFrom = lineFrom
        lineRefs[lineID] = dict
    }

    return (
        <div className="LineElementDiv" style={style} ref={setRef}>
            {children}
        </div>
    );
}

export default LineElement;
