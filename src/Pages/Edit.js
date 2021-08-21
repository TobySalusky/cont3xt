import '../Style/App.css';
import {Component, createContext, useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";

import reactCSS from 'reactcss'
import {SketchPicker} from 'react-color'
import {ConfigContext, EditConfigContext} from "../State/ConfigContext";
import {readConfig} from "../Util/Configurations";

export const TypeDataContext = createContext();

export const TypeDataProvider = (props) => {
    const [typeData, setTypeData] = useState([])

    return <TypeDataContext.Provider value={[typeData, setTypeData]}>{props.children}</TypeDataContext.Provider>;
}

function Edit() {

    const tabTypes = ['Domain', 'IP', 'PhoneNumber', 'Email', 'Hash', 'Text'];

    const [type, setType] = useState('');
    const [typePage, setTypePage] = useState(null);
    const [typePages, setTypePages] = useState({});

    const [rawConfigs, setRawConfigs] = useContext(ConfigContext)
    const [typeData, setTypeData] = useContext(TypeDataContext)
    const [editConfigIndex, setEditConfigIndex] = useContext(EditConfigContext)

    const matchColor = (color1, color2) => {
        const parse = require('color-parse')

        if (!color1 || !color2) return false

        let c1 = parse(color1)
        let c2 = parse(color2)

        return (c1.values[0] === c2.values[0] &&
            c1.values[1] === c2.values[1] &&
            c1.values[2] === c2.values[2] &&
            c1.alpha === c2.alpha);
    }

    const saveConfig = () => {
        let title = typeData['General'].title
        if (title === '') title = 'Untitled Config';
        let str = 'title: '+title+'\n';
        Object.keys(typeData).map(thisType => {
            if (thisType !== 'General') {
                let sectionStr = '\n'+thisType + ':\n'
                let hasEntry = false
                typeData[thisType].map(dict => {
                    if (dict.label !== undefined && dict.label !== '' && dict.formatLink !== undefined && dict.formatLink !== '') {
                        sectionStr += '"'+dict.label+'" '+dict.formatLink
                        if (!matchColor('orange', dict.color)) sectionStr += ' color: '+dict.color;
                        sectionStr += '\n';
                        hasEntry = true
                    }
                })

                if (hasEntry) str += sectionStr;
            }
        })

        if (editConfigIndex === -1) {
            setRawConfigs([...rawConfigs, str])
        } else {
            let arr = [...rawConfigs]
            arr[editConfigIndex] = str;
            setRawConfigs(arr)
        }
    }

    useEffect(() => { // init
        let pages = {};
        let data = {}
        tabTypes.map(thisType => {
            pages[thisType] = <LinkRowPage key={thisType} type={thisType}/>;
            data[thisType] = [{}];
        })
        pages['General'] = <GeneralPage/>
        data['General'] = {title: 'Untitled Config'}

        if (editConfigIndex !== -1) {

            const existingConfig = readConfig(rawConfigs[editConfigIndex])
            const linkDict = existingConfig.linkDict;
            Object.keys(linkDict).map(thisType => {
                data[thisType] = linkDict[thisType].map(linkData => {
                    return {...linkData}
                })
            })
            data['General'] = {title: existingConfig.title}
        }

        setTypePages(pages)
        setTypeData(data)
        setType('General')
    }, []);

    useEffect(() => {
        setTypePage(typePages[type])
    }, [type])

    return (
        <div className="App">
            <div className="SettingsTopBar">
                <Link to="/configurations">
                    <img className="IconButton" src="./images/backArrow.png" style={{width: 30, height: 30}} alt="back arrow" onClick={saveConfig}/>
                </Link>
                {['General', ...tabTypes].map(thisType => (
                    <LinkTypeTab selectedType={type} setType={setType} type={thisType}/>
                ))}
            </div>
            {typePage}
        </div>
    );
}

export default Edit;

export function GeneralPage() {

    const [typeData, setTypeData] = useContext(TypeDataContext)

    const setTitle = (e) => {
        let dict = {...typeData}
        dict['General'] = {...dict['General'], title: e.target.value}
        setTypeData(dict)
    }


    return (
        <div className="LinkRowSettingsPage">
            <h1 style={{fontSize: 50}}>General Settings</h1>
            <div className="LinkSettingsRow">
                <label className="GeneralLinkSettingLabel">Title:</label>
                <input aria-label="hi" className="LinkSettingTitle" autoComplete='off' type="text" value={typeData['General'].title} onChange={setTitle}/>
            </div>
        </div>
    )
}

export function LinkRowPage(props) {

    const [typeData, setTypeData] = useContext(TypeDataContext)

    const addRow = () => {
        let dict = {...typeData}
        let arr = dict[props.type]
        arr.push({})
        setTypeData(dict)
    }


    return (
        <div className="LinkRowSettingsPage">
            <h1 style={{fontSize: 50}}>{props.type}</h1>
            {typeData[props.type].map((dict, i) => (
                <LinkRow index={i} type={props.type} key={props.type+i}/>
            ))}
            <div className="LinkSettingsRow">
                <button className="LinkRowAddButton" onClick={addRow}>
                    +
                </button>
            </div>
        </div>
    )
}

export function LinkRow(props) {

    const [typeData, setTypeData] = useContext(TypeDataContext)

    const setLabel = (e) => {
        let dict = {...typeData}
        dict[props.type][props.index] = {...dict[props.type][props.index], label: e.target.value}
        setTypeData(dict)
    }

    const setFormatLink = (e) => {
        let dict = {...typeData}
        dict[props.type][props.index] = {...dict[props.type][props.index], formatLink: e.target.value}
        setTypeData(dict)
    }

    const setColor = (colorStr) => {
        let dict = {...typeData}
        dict[props.type][props.index] = {...dict[props.type][props.index], color: colorStr}
        setTypeData(dict)
    }

    const remove = () => {
        let dict = {...typeData}
        if (dict[props.type].length === 1) {
            dict[props.type][0] = {label: '', formatLink: ''}
        } else {
            dict[props.type].splice(props.index, 1)
        }
        setTypeData(dict)
    }

    return (
        <div className="LinkSettingsRow">
            <LinkRowColor color={typeData[props.type][props.index].color} setColor={setColor}/>
            <input className="LinkSettingName" autoComplete='off' type="text" value={typeData[props.type][props.index].label} onChange={setLabel}/>
            <input className="LinkSettingFormatLink" autoComplete='off' type="text" value={typeData[props.type][props.index].formatLink} onChange={setFormatLink}/>
            <button className="LinkSettingRemove" onClick={remove}>-</button>
        </div>
    )
}

export class LinkTypeTab extends Component {

    render() {

        const styles = reactCSS({
            'default': {
                color: {
                    background: (this.props.selectedType === this.props.type) ? 'lightgray' : 'gray'
                },
            },
        });

        return (
            <button className="SettingsTypeButton" style={styles.color} onClick={() => this.props.setType(this.props.type)}>{this.props.type}</button>
        )
    }
}

export function LinkRowColor(props) {

    const [state, setState] = useState({
        displayColorPicker: false,
        color: {
            r: 255,
            g: 0,
            b: 0,
            a: 1,
        },
    })

    useEffect(() => {

        const parse = require('color-parse')
        let initCol = parse(props.color ?? 'orange')

        setState({
            displayColorPicker: false,
            color: {
                r: initCol.values[0],
                g: initCol.values[1],
                b: initCol.values[2],
                a: initCol.alpha,
            },
        })
    }, [])

    useEffect(() => {
        props.setColor(colorString())
    }, [state.color])

    const handleClick = () => {
        setState({ ...state, displayColorPicker: !state.displayColorPicker })
    };

    const handleClose = () => {
        setState({ ...state, displayColorPicker: false })
    };

    const handleChange = (color) => {
        setState({ ...state, color: color.rgb })
    };

    const colorString = () => `rgba(${ state.color.r }, ${ state.color.g }, ${ state.color.b }, ${ state.color.a })`;

    const styles = reactCSS({
        'default': {
            color: {
                width: '40px',
                height: '40px',
                borderRadius: '5px',
                background: colorString(),
            },
            swatch: {
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
            },
            popover: {
                position: 'absolute',
                zIndex: '2',
            },
            cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
            },
        },
    });

    return (
        <div className="Center">
            <div style={ styles.swatch } onClick={ handleClick }>
                <div style={ styles.color } />
            </div>
            { state.displayColorPicker ? <div style={ styles.popover }>
                <div style={ styles.cover } onClick={ handleClose }/>
                <SketchPicker color={ state.color } onChange={ handleChange }/>
            </div> : null }

        </div>
    );

}
