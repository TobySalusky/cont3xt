import React, {useEffect, useState} from "react";
import {LocalStorage} from "../Util/LocalStorage";

export const LeftStatsPanel: React.FC = () => {
    const [open, setOpen] = useState(LocalStorage.getOrDefault('LeftSidePanelOpen', false));

    useEffect(() => {
        LocalStorage.set('LeftSidePanelOpen', open);
    }, [open])

    return (
        <div className='LeftSidebar'>
            {!open ||
			    <div className='LeftSidebarContentArea'/>
            }
            <div className='LeftSidebarCollapsableArea' style={!open ? {borderWidth: 0} : undefined} onClick={()=>setOpen(!open)}>
                <p>{open ? '<' : '>'}</p>
            </div>
        </div>
    );
}