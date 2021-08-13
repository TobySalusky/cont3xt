import React, {useContext, useState} from "react";
import {ActiveIntegrationContext} from "../State/ActiveIntegrationContext";

export const RightIntegrationPanel: React.FC = () => {
    const [activeIntegration,] = useContext(ActiveIntegrationContext);
    const [open, setOpen] = useState(false);

    return (
        <div className='RightSideBar'>
            <div className='RightSidebarCollapsableArea' style={!open ? {borderWidth: 0} : undefined} onClick={()=>setOpen(!open)}>
                <p>{open ? '>' : '<'}</p>
            </div>
            {!open ||
                <div className='RightSidebarContentArea'>
                    {activeIntegration}
                </div>
            }
        </div>
    );
}