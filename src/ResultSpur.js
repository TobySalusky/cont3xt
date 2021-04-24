import './App.css';
import LineElement from "./LineElement";
import DarkTooltip from "./DarkTooltip";


export default function ResultSpur({result}) {

    const infoBox = (title, data) => {
        let text = data.val
        let colors = data.colorData

        console.log(text, colors)

        return (
            <div className="ResultBox" style={{justifyContent: 'space-between', marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8}}>
                <div style={{display: 'flex', justifyContent:'flex-start', maxWidth: 500, flexWrap: "wrap"}}>
                    <p style={{paddingRight: 8, color: 'orange', fontWeight: 'bold'}}>{title}:</p>

                    {
                        colors.map(colorEntry => {
                            const snip = text.substring(0, colorEntry[1]).replace(' ', '\xa0')
                            text = text.substring(colorEntry[1])
                            return <p style={{color: colorEntry[0]}}>{snip}</p>
                        })
                    }

                </div>
            </div>
        );
    }

    const colors = {
        plain: 'white',
        brackets: 'yellow',
        comma: 'orange',
        number: '#77e8ec',
        boolean: '#ff699e',
        string: '#adffc6',
        key:'#cb91ff'
    }

    const toColorText = (variable) => {

        let returnVar = undefined;
        let colorData = [];

        const isDict = variable => {
            return typeof variable === "object" && !Array.isArray(variable);
        };

        if (isDict(variable)) {
            let str = '{'
            colorData.push([colors.brackets, 1])

            let init = true
            for (const key of Object.keys(variable)) {
                let entry = toColorText(variable[key])
                const val = entry.val

                if (val) {
                    if (!init) {
                        str += ', '
                        colorData.push([colors.comma, 2])
                    }
                    str += `${key}: ${val}`
                    colorData = [...colorData, [colors.key, key.length], [colors.plain, 2], ...entry.colorData]
                    init = false
                }
            }
            str += '}'
            colorData.push([colors.brackets, 1])

            if (str !== '{}') returnVar = str

        } else if (Array.isArray(variable)) {

            let str = '['
            colorData.push([colors.brackets, 1])

            let init = true
            for (const element of variable) {
                let entry = toColorText(element)
                const val = entry.val

                if (val) {
                    if (!init) {
                        str += ', '
                        colorData.push([colors.comma, 2])
                    }
                    str += val
                    colorData = [...colorData, ...entry.colorData]
                    init = false
                }
            }
            str += ']'
            colorData.push([colors.brackets, 1])

            if (str !== '[]') returnVar = str
        } else {

            returnVar = variable

            let col = colors.plain
            if (typeof variable === "boolean"){
                col = colors.boolean
            } else if (typeof variable === "number") {
                col = colors.number
            } else if (typeof variable === "string") {
                col = colors.string
            }
            colorData.push([col, (''+returnVar).length])
        }

        return {val: returnVar, colorData}
    }

    const genBoxSpur = () => {

        return (
            <LineElement lineID="spur" lineFrom="main" style={{marginLeft: 40, marginBottom: 5}}>
                <div className="WhoIsBox">
                    <p style={{fontWeight:'bolder', color:'cyan'}}>SPUR</p>
                    {
                        Object.keys(result.spurResult.data).map(key => {
                            const colorText = toColorText(result.spurResult.data[key])

                            return (colorText.val && key !== 'ip') ? infoBox(key, colorText) : null
                        })
                    }
                </div>
            </LineElement>
        );
    }


    return (
        <div>

            {
                (result.spurResult && result.spurResult.data) ? genBoxSpur() : null
            }

        </div>
    );
}

