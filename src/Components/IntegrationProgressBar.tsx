import React from "react";
import {IntegrationGenerationProgressReport} from "../Types/Types";
import {makeUnbreakable, typeColors} from "../Util/Util";
import {DarkBox} from "./DarkBox";
import {Colors} from "../Style/Theme";

export const IntegrationProgressBar: React.FC<{report: IntegrationGenerationProgressReport}> = ({report}) => {

    const {numOutgoing, numReturned, numFailed} = report;

    const failures = numFailed > 0;
    const finished = (numFailed + numReturned) === numOutgoing;

    const numStr = Math.trunc(((numReturned + numFailed) / numOutgoing * 100)).toString();

    return (
        <div className='ProgressBarBlock' style={{
            bottom: finished ? -100 : 0,
            opacity: finished ? 0 : 1,
        }}>
            <DarkBox>
                <p style={{fontSize: 16, fontWeight: 'bold', color: Colors.highlight}}>Progress:</p>
                <span>
                    <span className='ProgressBarWrapper'>
                        <div className='ProgressBarSuccess' style={{width: `${(numReturned / numOutgoing * 100)}%`}}/>
                            {
                                !failures || <div className='ProgressBarFail' style={{width: `${(numFailed / numOutgoing * 100)}%`}}/>
                            }
                    </span>
                    <p style={{fontSize: 16, marginLeft: 5}}>{numStr}%{makeUnbreakable(' '.repeat(3 - numStr.length))}</p>
                </span>
                <span style={{fontSize: 16}}>
                    {numReturned}/{numOutgoing} returned {failures ? <p>{makeUnbreakable(' | ')}<b style={{color: typeColors.malicious}}>{numFailed} failed</b></p> : ''}
                </span>
            </DarkBox>
        </div>
    );
}
