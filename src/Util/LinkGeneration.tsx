/* eslint-disable no-template-curly-in-string */

import {LinkGenerationData} from "../Types/Types";

export const fillLinkFormat = (formatLink : string, data : LinkGenerationData) : string => {

    formatLink = formatLink.replaceAll('${type}', data.type);
    formatLink = formatLink.replaceAll('${subType}', data.subType);
    formatLink = formatLink.replaceAll('${indicator}', data.indicator);
    formatLink = formatLink.replaceAll('${numDays}', String(data.numDays));
    formatLink = formatLink.replaceAll('${startDate}', data.startDate);

    return formatLink;
}
