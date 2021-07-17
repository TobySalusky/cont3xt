export const stripTrailingPeriod = (str) => {
	if (str.lastIndexOf('.') === str.length - 1) return str.substring(0, str.length - 1);
	return str;
}

const DEBUG = true; // Enable/Disable logging

export function log(){
	if(DEBUG){
		console.log.apply(console, arguments);
	}
}

export const typeColors = {
	plain: 'white',
	brackets: 'yellow',
	comma: 'orange',
	number: '#77e8ec',
	boolean: '#ff699e',
	string: '#adffc6',
	key:'#cb91ff'
}

export const toColorElems = (data) => {
	
	let text = data.val
	let colors = data.colorData
	
	return colors.map(colorEntry => {
		const snip = text.substring(0, colorEntry[1]).replace(' ', '\xa0')
		text = text.substring(colorEntry[1])
		return <p style={{color: colorEntry[0]}}>{snip}</p>
	})
}

export const toColorText = (variable, brackets = true, appendComma = false, spaces = true) => {
	
	let returnVar = undefined;
	let colorData = [];
	
	const isDict = variable => {
		return typeof variable === "object" && !Array.isArray(variable);
	};
	
	if (isDict(variable)) {
		let str = '';
		if (brackets) {
			str += '{';
			colorData.push([typeColors.brackets, 1]);
		}
		
		let init = true
		for (const key of Object.keys(variable)) {
			
			if (key === 'exists') continue
			
			let entry = toColorText(variable[key])
			const val = entry.val
			
			if (val) {
				if (!init) {
					str += spaces ? ', ' : ',';
					colorData.push([typeColors.comma, spaces ? 2 : 1]);
				}
				const sep = spaces ? ': ' : ':';
				str += `${key}${sep}${val}`
				colorData = [...colorData, [typeColors.key, key.length], [typeColors.plain, sep.length], ...entry.colorData]
				init = false
			}
		}
		
		if (brackets) {
			str += '}'
			colorData.push([typeColors.brackets, 1])
		}
		
		if (str !== '{}') returnVar = str
		
	} else if (Array.isArray(variable)) {
		
		let str = '';
		if (brackets) {
			str += '[';
			colorData.push([typeColors.brackets, 1]);
		}
		
		let init = true
		for (const element of variable) {
			let entry = toColorText(element)
			const val = entry.val
			
			if (val) {
				if (!init) {
					str += spaces ? ', ' : ',';
					colorData.push([typeColors.comma, spaces ? 2 : 1]);
				}
				str += val
				colorData = [...colorData, ...entry.colorData]
				init = false
			}
		}
		if (brackets) {
			str += ']';
			colorData.push([typeColors.brackets, 1]);
		}
		
		if (str !== '[]') returnVar = str
	} else {
		
		returnVar = '' + variable
		
		let col = typeColors.plain
		if (typeof variable === "boolean"){
			col = typeColors.boolean
		} else if (typeof variable === "number") {
			col = typeColors.number
		} else if (typeof variable === "string") {
			col = typeColors.string
		}
		colorData.push([col, (''+returnVar).length])
	}
	
	// TODO: figure out what to do when input fits no types (returnVar is undefined)
	// add null case?
	/*
	if (!brackets) {
		let newReturnVar = '';
		const newColorData = [];
		let i = 0;
		for (const colorDataEntry of colorData) {
			const len = colorDataEntry[1];
			const sub = returnVar.substring(i, i+len);
			if (sub !== '{' && sub !== '}' && sub !== '[' && sub !== ']') {
				newReturnVar += sub;
				newColorData.push(colorDataEntry)
			}
			i++;
		}
		returnVar = newReturnVar;
		colorData = newColorData;
	}*/
	
	if (appendComma) {
		returnVar += ',';
		colorData.push([typeColors.comma, 1]);
	}
	
	return {val: returnVar, colorData}
}

export const jsonLines = (dictionary) => {
	
	let str = ''
	
	for (const key of Object.keys(dictionary)) {
		const text = toColorText(dictionary[key]).val
		
		if (text) str += `${key}: ${text}\n`
	}
	
	return str
}
