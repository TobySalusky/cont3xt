import React, {useEffect, useState} from "react";
import {LocalStorage} from "../Util/LocalStorage";
import {CircleCheckBox} from "./CircleCheckBox";
import {Global} from "../Settings/Global";
import {Settings} from "../Settings/Settings";

export const LeftStatsPanel: React.FC = () => {
    const [open, setOpen] = useState(LocalStorage.getOrDefault('LeftSidePanelOpen', false));
    const [settings, setSettings] = useState(LocalStorage.getOrDefault<Settings>('settings', {
        integrationPopups: true,
        integrationPanelDelayTime: 0.2,
    }));

    useEffect(() => {
        LocalStorage.set('LeftSidePanelOpen', open);
    }, [open])

    useEffect(() => {
        LocalStorage.set('settings', settings);
        Global.settings = settings;
    }, [settings])

    const editSettings = (changes: any) => {
        setSettings({...settings, ...changes});
    }

    // TODO: allow change popup delay panel

    return (
        <div className='LeftSidebar'>
            {!open ||
			    <div className='LeftSidebarContentArea'>
                    <span className="HoverClickLighten" onClick={() => {
                        editSettings({integrationPopups: !settings.integrationPopups})
                    }}>
                        Integration Popups <CircleCheckBox filled={settings.integrationPopups}/>
                    </span>
                </div>
            }
            <div className='LeftSidebarCollapsableArea' style={!open ? {borderWidth: 0} : undefined} onClick={()=>setOpen(!open)}>
                <p>{open ? '<' : '>'}</p>
            </div>
        </div>
    );
}
