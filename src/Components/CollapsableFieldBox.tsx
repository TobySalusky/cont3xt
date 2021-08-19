import React, {useState} from "react";
import {Colors} from "../Style/Theme";

export const CollapsableFieldBox: React.FC<{title: string, inline?: boolean, startOpen?: boolean}> = ({title, inline = false, startOpen = true, children}) => {

    const [open, setOpen] = useState<boolean>(startOpen);

    const titleNode = (
        <div className="HoverClickLighten" onClick={()=>setOpen(!open)} style={{marginRight: 8}}>
            <p style={{color: Colors.highlight, fontWeight: 'bold'}}>{title}:</p>
        </div>
    );

    const mainNode = open ? children : (
        <div style={{backgroundColor: Colors.neutral, borderRadius: 3}}>
            <p style={{borderRadius: 3, paddingInline: 3}} className="HoverClickLighten" onClick={()=>setOpen(!open)}>...</p>
        </div>
    );

    const shouldInline = inline || !open;

    if (shouldInline) return (
        <div className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}>
            <div style={{display: 'flex', justifyContent:'flex-start', maxWidth: 1000, flexWrap: "wrap", flexDirection: 'row'}}>
                {titleNode}
                {mainNode}
            </div>
        </div>
    );

    return (
        <div className="ResultBox" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8, maxWidth: 1000}}>
            {titleNode}
            {mainNode}
        </div>
    );
}
