import {useEffect, useRef} from 'react';

function TestComp (props) {

    useEffect(() => {
        console.log(props.children)

        for (const el of props.children) {
            console.log(el)
            console.log('ref',el.ref)
            //console.log(el.getBoundingClientRect())
        }
    }, []);


    return (
        <div>
            {props.children}
        </div>
    );
}

export default TestComp;
