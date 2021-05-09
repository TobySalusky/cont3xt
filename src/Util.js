export const toColorText = (variable) => {
	
	const colors = {
		plain: 'white',
		brackets: 'yellow',
		comma: 'orange',
		number: '#77e8ec',
		boolean: '#ff699e',
		string: '#adffc6',
		key:'#cb91ff'
	}
	
	let returnVar = undefined;
	let colorData = [];
	
	const isDict = variable => {
		return typeof variable === "object" && !Array.isArray(variable);
	};
	
	if (isDict(variable)) {
		let str = '{'
		colorData.push([colors.brackets, 1])
		
		let init = true
		for (const key of Object.keys(variable)) {
			
			if (key === 'exists') continue
			
			if (key === 'anonymous' && variable[key] === false) continue
			
			let entry = toColorText(variable[key])
			const val = entry.val
			
			if (val) {
				if (!init) {
					str += ', '
					colorData.push([colors.comma, 2])
				}
				str += `${key}: ${val}`
				colorData = [...colorData, [colors.key, key.length], [colors.plain, 2], ...entry.colorData]
				init = false
			}
		}
		str += '}'
		colorData.push([colors.brackets, 1])
		
		if (str !== '{}') returnVar = str
		
	} else if (Array.isArray(variable)) {
		
		let str = '['
		colorData.push([colors.brackets, 1])
		
		let init = true
		for (const element of variable) {
			let entry = toColorText(element)
			const val = entry.val
			
			if (val) {
				if (!init) {
					str += ', '
					colorData.push([colors.comma, 2])
				}
				str += val
				colorData = [...colorData, ...entry.colorData]
				init = false
			}
		}
		str += ']'
		colorData.push([colors.brackets, 1])
		
		if (str !== '[]') returnVar = str
	} else {
		
		returnVar = '' + variable
		
		let col = colors.plain
		if (typeof variable === "boolean"){
			col = colors.boolean
		} else if (typeof variable === "number") {
			col = colors.number
		} else if (typeof variable === "string") {
			col = colors.string
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
