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