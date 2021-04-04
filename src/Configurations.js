
export function readConfig(fullText) {

    const lines = fullText.split("\n");

    let title = 'Untitled';
    let linkDict = {};

    let linkArr;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        let lower = line.toLowerCase();

        if (line.length === 0) continue; // skips empty lines

        if (lower.startsWith('title:')) { // Title

            title = line.substring(6).trim();

        } else if (line.endsWith(':')) { // Starting typed segments

            linkArr = [];
            linkDict[line.substring(0, line.length - 1)] = linkArr;

        } else if (Object.keys(linkDict).length > 0 && line.startsWith('\"')) {
            let lastQuote = line.lastIndexOf('\"');
            let name = line.substring(1, lastQuote).trim();
            let formatLink = line.substring(lastQuote + 1).trim();
            linkArr.push([name, formatLink])
        }
    }

    return {title, linkDict};
}

export function createConfig(fullText) {

    const {title, linkDict} = readConfig(fullText)

    return (data) => {
        let genLinks = []
        if (data.type in linkDict) {
            genLinks = linkDict[data.type];
        }
        return {title, genLinks};
    }
}