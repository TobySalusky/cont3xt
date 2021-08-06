import DarkTooltip from "../Style/DarkTooltip";

export const OptionalMaxLengthTooltip = ({value, maxLen}) => {
    const len = value.length;

    if (len <= maxLen) return <p>{value}</p>;
    return (
        <DarkTooltip title={value} interactive>
            <span>
                <p>{value.substr(0, maxLen)}</p>
                <p style={{color: 'orange'}}>...</p>
            </span>
        </DarkTooltip>
    );
}