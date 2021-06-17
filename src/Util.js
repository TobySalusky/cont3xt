export const typeColors = {
	plain: 'white',
	brackets: 'yellow',
	comma: 'orange',
	number: '#77e8ec',
	boolean: '#ff699e',
	string: '#adffc6',
	key:'#cb91ff'
}

export const toColorText = (variable) => {
	
	let returnVar = undefined;
	let colorData = [];
	
	const isDict = variable => {
		return typeof variable === "object" && !Array.isArray(variable);
	};
	
	if (isDict(variable)) {
		let str = '{'
		colorData.push([typeColors.brackets, 1])
		
		let init = true
		for (const key of Object.keys(variable)) {
			
			if (key === 'exists') continue
			
			let entry = toColorText(variable[key])
			const val = entry.val
			
			if (val) {
				if (!init) {
					str += ', '
					colorData.push([typeColors.comma, 2])
				}
				str += `${key}: ${val}`
				colorData = [...colorData, [typeColors.key, key.length], [typeColors.plain, 2], ...entry.colorData]
				init = false
			}
		}
		str += '}'
		colorData.push([typeColors.brackets, 1])
		
		if (str !== '{}') returnVar = str
		
	} else if (Array.isArray(variable)) {
		
		let str = '['
		colorData.push([typeColors.brackets, 1])
		
		let init = true
		for (const element of variable) {
			let entry = toColorText(element)
			const val = entry.val
			
			if (val) {
				if (!init) {
					str += ', '
					colorData.push([typeColors.comma, 2])
				}
				str += val
				colorData = [...colorData, ...entry.colorData]
				init = false
			}
		}
		str += ']'
		colorData.push([typeColors.brackets, 1])
		
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
