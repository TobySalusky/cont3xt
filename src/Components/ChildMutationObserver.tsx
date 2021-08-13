import React, {useCallback, useContext, useRef} from "react";
import {useMutationObservable} from "../Hooks/useMutationObservable";
import {MutationContext} from "../State/MutationContext";

export class MutationUtil {
    static mutationCount = 0;
}

export const ChildMutationObserver: React.FC = ({children}) => {
    const divRef = useRef<HTMLDivElement>(null);

    const [, setMutationCount] = useContext(MutationContext);

    const onMutate = useCallback(()=>{
        MutationUtil.mutationCount++;
        setMutationCount(MutationUtil.mutationCount)
    }, [setMutationCount]);

    useMutationObservable(divRef.current, onMutate);

    return (
        <div ref={divRef}>
            {children}
        </div>
    );
}