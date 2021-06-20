

export const fillLinkFormat = (formatLink, data) => {

    formatLink = formatLink.replaceAll('${type}', data.type);
    formatLink = formatLink.replaceAll('${subType}', data.subType);
    formatLink = formatLink.replaceAll('${indicator}', data.indicator);
    formatLink = formatLink.replaceAll('${numDays}', data.numDays);
    formatLink = formatLink.replaceAll('${startDate}', data.startDate);

    return formatLink;
}
