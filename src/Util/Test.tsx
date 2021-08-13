import React from "react";

export const TsTest : React.FC<{
    num : number;
    str : string;
    arr : [];
    val? : 'v1' | 'v2';
}> = ({num, str, arr, val, children})  => {
    return (
        <div style={{width: 100, height: 100, backgroundColor: 'red'}}>
            <p>{num}</p>
            <p>{str}</p>
            <p>{arr}</p>
            <p>{val}</p>
            <p>{children}</p>
        </div>
    );
}