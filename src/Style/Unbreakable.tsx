import React from "react";
import {makeUnbreakable} from "../Util/Util";

export const Unbreakable: React.FC<{style?: React.CSSProperties}> = ({children, style}) => {
    return <p style={style}>{makeUnbreakable(String(children))}</p>
}
