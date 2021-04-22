import { useEffect, useContext } from 'react';
import {LineContext} from "./LineContext";

function LineElement (props) {

    const [lineRefs, setLineRefs] = useContext(LineContext)

    const settRef = (el) => {
        el => lineRefs[]
    }

    return (
        <div ref={el => settRef(el)}>
            {props.children}
        </div>
    );
}

export default LineElement;
