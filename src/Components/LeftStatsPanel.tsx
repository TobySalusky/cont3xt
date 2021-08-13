import React, {useContext, useState} from "react";

export const LeftStatsPanel: React.FC = () => {
    const [open, setOpen] = useState(false);

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