import DarkTooltip from "../Style/DarkTooltip";

export const MaxLen = ({max, children}) => {
    
    if (typeof children !== 'string') console.log('Error-MaxLen child should be of type string')
    const text = children;
    const len = text.length;

    if (len <= max) return <p>{text}</p>;
    
    return (
        <DarkTooltip title={text} interactive>
            <span>
                <p>{text.substr(0, max)}</p>
                <p style={{color: 'orange'}}>...</p>
            </span>
        </DarkTooltip>
    );
}