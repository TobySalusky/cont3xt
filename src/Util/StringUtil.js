import { countryCodeEmoji } from 'country-code-emoji';


export const emojiFlagOrEmptyString = (countryCode) => {
	try {
		return countryCodeEmoji(countryCode);
	} catch {
		return '';
	}
}

export const camelToCapWords = (str) => {

	let newStr = '';
	
	for (let i = 0; i < str.length; i++) {
		const char = str.charAt(i), upper = char.toUpperCase();
		if (i === 0) {
			newStr += upper
		} else if (char === upper) {
			newStr += ` ${upper}`;
		} else {
			newStr += char;
		}
	}
	return newStr;
}

export const tabLines = (multilineStr, spaces = -1) => {
	const lines = multilineStr.split(/\r?\n/);
	
	return lines.map(line => `${spaces === -1 ? '\t' : ' '.repeat(spaces)}${line}`).join('\n');
}
