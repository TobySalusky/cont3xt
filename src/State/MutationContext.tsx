import React, {createContext, useRef, useState} from 'react';

// @ts-ignore
export const MutationContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>]>();

export const MutationProvider: React.FC = (props) => {
    const [val, setVal] = useState(0);

    // @ts-ignore
    return <MutationContext.Provider value={[val, setVal]}>{props.children}</MutationContext.Provider>;
}


