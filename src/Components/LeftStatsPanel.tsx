import React, {useEffect, useState} from "react";
import {LocalStorage} from "../Util/LocalStorage";
import {CircleCheckBox} from "./CircleCheckBox";
import {Global} from "../Settings/Global";
import {defaultSettings, SettingChanges, Settings, validateSettings} from "../Settings/Settings";
// @ts-ignore
import styled from "styled-components";
import {makeUnbreakable} from "../Util/Util";
import {Colors} from "../Style/Theme";

const CenteredSpan = styled.span`
      display: flex;
      align-items: center;
    `;

const Section: React.FC = ({children}) => {
    return <div className="SettingsSection">{children}</div>;
}

const ToggleOption: React.FC<{value: boolean, onClick: ()=>void, color?: string}> = ({children, value, onClick, color}) => {
    return (
        <CenteredSpan className="HoverClickLighten" onClick={onClick} style={{color}}>
            {makeUnbreakable(children + ' ')}<CircleCheckBox filled={value} color={color}/>
        </CenteredSpan>
    );
}

const NumInput: React.FC<{width: number, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>)=>void}> = ({children, width = 30, value, onChange}) => {
    return (
        <CenteredSpan>
            {makeUnbreakable(children + ' ')}
            <input className="SideBarInputField" style={{width}} type="number" min={0} value={value}
                   onChange={onChange}/>
        </CenteredSpan>
    );
}

const getValidatedSettings = (): Settings => {
    const possibleSettings = LocalStorage.get<Settings>('settings');
    if (possibleSettings === null || !validateSettings(possibleSettings)) return defaultSettings;
    return possibleSettings;
}

export const LeftStatsPanel: React.FC = () => {
    const [open, setOpen] = useState(LocalStorage.getOrDefault('LeftSidePanelOpen', false));
    const [settings, setSettings] = useState(getValidatedSettings());

    useEffect(() => {
        LocalStorage.set('LeftSidePanelOpen', open);
    }, [open])

    useEffect(() => {
        LocalStorage.set('settings', settings);
        Global.settings = settings;
    }, [settings])

    const editSettings = (changes: SettingChanges) => {
        setSettings({...settings, ...changes});
    }

    const withAll = (obj: any, desiredVal: any): any => {
        const newObj: any = {};
        for (const key of Object.keys(obj)) {
            newObj[key] = desiredVal;
        }
        return newObj;
    }

    const areAll = (obj: object, desiredVal: any): boolean => {
        for (const val of Object.values(obj)) {
            if (val !== desiredVal) return false;
        }
        return true;
    }

    // TODO: allow change popup delay panel

    return (
        <div className='LeftSidebar'>
            {!open ||
			    <div className='LeftSidebarContentArea'>
				    <Section>
					    <ToggleOption value={settings.integrationPopups} onClick={() => {
                            editSettings({integrationPopups: !settings.integrationPopups})
                        }}>Integration Popups</ToggleOption>
                    </Section>
                    <Section>
	                    <NumInput value={settings.integrationPanelDelayTime}
	                              onChange={e => editSettings({integrationPanelDelayTime: parseFloat(e.target.value)})}
	                              width={30}
	                              key='delay'
	                    >
		                    Panel Display Delay
	                    </NumInput>
                    </Section>
                    <Section>
	                    <ToggleOption value={!areAll(settings.integrationMask, false)} onClick={() => {
	                        const newMask = (()=>{
                                if (!areAll(settings.integrationMask, false)) return withAll(settings.integrationMask, false);
	                            return withAll(settings.integrationMask, true);
                            })();
                            editSettings({integrationMask: newMask})
                        }}>Active Integrations</ToggleOption>
	                    <div className="RightAlignDown">
                            {Object.keys(settings.integrationMask).map((integrationType: string) => (
                                <ToggleOption onClick={() => editSettings({integrationMask: {...settings.integrationMask, ...{[integrationType]: !settings.integrationMask[integrationType]}}})}
                                              value={settings.integrationMask[integrationType]}
                                              color={settings.integrationMask[integrationType] ? 'lightgray' : 'grey'}
                                >
                                    {integrationType}
                                </ToggleOption>
                            ))}
	                    </div>
                    </Section>
                </div>
            }
            <div className='LeftSidebarCollapsableArea' style={!open ? {borderWidth: 0} : undefined} onClick={()=>setOpen(!open)}>
                <p>{open ? '<' : '>'}</p>
            </div>
        </div>
    );
}
