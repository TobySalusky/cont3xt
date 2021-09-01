import React, {useContext, useEffect, useState} from "react";
import {ActiveIntegrationContext} from "../State/ActiveIntegrationContext";
import {LocalStorage} from "../Util/LocalStorage";

export const RightIntegrationPanel: React.FC = () => {
    const [activeIntegration,] = useContext(ActiveIntegrationContext);
    const [open, setOpen] = useState(LocalStorage.getOrDefault('RightSidePanelOpen', true));

    useEffect(() => {
        LocalStorage.set('RightSidePanelOpen', open);
    }, [open])

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
