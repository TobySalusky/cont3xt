import { useEffect, useContext } from 'react';
import {LineContext} from "../State/LineContext";

function LineElement ({lineID, lineFrom, children, style}) {

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
