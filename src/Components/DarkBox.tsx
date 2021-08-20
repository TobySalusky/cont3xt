import React, {CSSProperties} from "react";

export const DarkBox: React.FC<{style?: CSSProperties}> = ({children, style = {}, ...props}) => {

    return (
        <div className="ResultBox" style={{...style, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: 5, padding: 5, fontSize: 12, borderRadius: 8, maxWidth: 1000}}>
            {children}
        </div>
    );
}
