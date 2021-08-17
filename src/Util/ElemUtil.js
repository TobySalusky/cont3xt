import DarkTooltip from "../Style/DarkTooltip";
import { Colors } from '../Style/Theme';

export const MaxLen = ({max, children}) => {
    
    if (children == null) return null;
    
    if (typeof children !== 'string') console.log('Error-MaxLen child should be of type string', children)
    const text = children;
    const len = text.length;

    if (len <= max) return <p>{text}</p>;
    
    return (
        <DarkTooltip title={text} interactive>
            <span>
                <p>{text.substr(0, max)}</p>
                <p style={{color: Colors.highlight}}>...</p>
            </span>
        </DarkTooltip>
    );
}
