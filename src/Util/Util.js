import ComponentTooltip from "../Components/ComponentTooltip";

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
	key: '#cb91ff',
	link: '#60dfff',
}

export const toColorElemsBreakCommas = (data) => {
	let text = data.val
	let colors = data.colorData

	const textList = [''];
	const colorDataList = [[]];
	let i = 0;
	colors.forEach(entry => {
		const snip = text.substr(i, entry[1]);
		// if (snip.startsWith('}') || snip.startsWith(']')) {
		// 	colorDataList.push([]);
		// 	textList.push('');
		// }
		colorDataList[colorDataList.length - 1].push(entry);
		textList[textList.length - 1] += snip;
		if (snip.startsWith(',') /*|| snip.startsWith('{') || snip.startsWith('[')*/) {
			colorDataList.push([]);
			textList.push('');
		}
		i += entry[1];
	})

	return (
		<div style={{display: 'flex', flexDirection: 'column'}}>
			{colorDataList.map((colorDataListEntry, i) =>
				<span style={{display: 'flex', flexDirection: 'row'}}>
					{toColorElems({val: textList[i], colorData: colorDataListEntry})}
				</span>
			)}
		</div>
	);
}

export const toColorElems = (data) => {
	
	let text = data.val
	let colors = data.colorData
	
	return colors.map(colorEntry => {
		const snip = text.substring(0, colorEntry[1]).replace(' ', '\xa0')
		text = text.substring(colorEntry[1])
		// links
		if (snip.startsWith('http://') || snip.startsWith('https://')) {
			const aNode = (
				<a href={snip} target="_blank" rel="noreferrer" style={{color: typeColors.link, textDecoration: 'none'}}>
					{snip}
				</a>
			);

			if (snip.endsWith('.png')) {
				return (
					<ComponentTooltip zIndex={2} comp={
						<div style={{maxWidth: 500, height: 'auto'}}>
							<img style={{height:'100%', width:'100%', objectFit:'contain'}}
								 src={snip} alt="urlscan screenshot"/>
						</div>
					}>
						{aNode}
					</ComponentTooltip>
				);
			}

			return aNode;
		}

		// general elements
		return <p style={{color: colorEntry[0]}}>{snip}</p>
	})
}

export const toColorText = (variable, brackets = true, appendComma = false, spaces = true) => {
	
	try {
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
		
	} catch (e) {
		const failureMessage = 'FAILED_TO_PARSE';
		return {val: failureMessage, colorData: [['red', failureMessage.length]]};
	}
}

const fullText = colorData => {
	return colorData.map(entry => entry[1]).join();
}

export const toColorTextWIP = (variable, settings = {}) => {

	const {brackets = true, appendComma = false, spaces = true, multiline = true} = settings;

	const emptyDict = colorData => colorData.length === 2 && fullText(colorData) === '{}';
	const emptyArr = colorData => colorData.length === 2 && fullText(colorData) === '[]';

	const isDict = variable => {
		return typeof variable === "object" && !Array.isArray(variable);
	};

	const tabIn = colorData => {
		const thisColorData = [];
		const tab = () => thisColorData.push(['white', '  ']);
		tab();
		for (let i = 0; i < colorData.length; i++) {
			const entry = colorData[i];
			thisColorData.push(entry);
			if (entry[1] === '\n') tab();
		}
		return thisColorData;
	}

	try {
		let colorData = [];

		const commaStr = spaces ? ', ' : ',';
		const sep = spaces ? ': ' : ':';

		const breakLine = (data) => {
			if (multiline) data.push(['red', '\n']);
		}

		if (isDict(variable)) {
			if (brackets) {
				colorData.push([typeColors.brackets, '{']);
				breakLine(colorData);
			}

			let innerColorData = [];

			let init = true
			for (const key of Object.keys(variable)) {
				
				let entry = toColorTextWIP(variable[key], settings)

				if (entry) {
					if (!init) {
						innerColorData.push([typeColors.comma, commaStr]);
						breakLine(innerColorData);
					}
					innerColorData = [...innerColorData, [typeColors.key, key], [typeColors.plain, sep], ...entry.data];
					init = false;
				}
			}

			if (multiline) innerColorData = tabIn(innerColorData);
			colorData = [...colorData, ...innerColorData];

			if (brackets) {
				breakLine(colorData);
				colorData.push([typeColors.brackets, '}'])
			}

			if (emptyDict(colorData)) return null;

		} else if (Array.isArray(variable)) {

			if (brackets) {
				colorData.push([typeColors.brackets, '[']);
			}

			let init = true
			for (const element of variable) {
				const entry = toColorTextWIP(element, settings)

				if (entry) {
					if (!init) {
						colorData.push([typeColors.comma, commaStr]);
					}
					colorData = [...colorData, ...entry.data]
					init = false
				}
			}
			if (brackets) {
				colorData.push([typeColors.brackets, ']']);
			}

			if (emptyArr(colorData)) return null;
		} else {

			let col = typeColors.plain
			if (typeof variable === "boolean"){
				col = typeColors.boolean
			} else if (typeof variable === "number") {
				col = typeColors.number
			} else if (typeof variable === "string") {
				col = typeColors.string
			}
			colorData.push([col, '' + variable])
		}

		if (appendComma) {
			colorData.push([typeColors.comma, ',']);
		}

		return createColorDataObj(colorData);

	} catch (e) {
		console.log(e)
		const failureMessage = 'FAILED_TO_PARSE';
		createColorDataObj([['red', failureMessage]]);
	}
}

const createColorDataObj = (data) => {
	return {
		data: data,
		genText: () => fullText(this.data),
	};
}

export const toColorElemsMultilineWIP = (colorData) => {
	const list = [[]];

	for (const colorDataEntry of colorData.data) {
		if (colorDataEntry[1] === '\n') {
			list.push([])
		} else {
			list[list.length - 1].push(colorDataEntry);
		}
	}

	return (
		<div style={{display: 'flex', flexDirection: 'column'}}>
			{list.map(data => createColorDataObj(data)).map(dataObj =>
				<span style={{display: 'flex', flexDirection: 'row'}}>
					{toColorElemsWIP(dataObj)}
				</span>
			)}
		</div>
	);
}

export const toColorElemsWIP = (colorData) => {

	return colorData.data.map(([color, text]) => {
		text = text.replaceAll(' ', '\xa0')

		// links
		if (text.startsWith('http://') || text.startsWith('https://')) {
			const aNode = (
				<a href={text} target="_blank" rel="noreferrer" style={{color: typeColors.link, textDecoration: 'none'}}>
					{text}
				</a>
			);

			if (text.endsWith('.png')) {
				return (
					<ComponentTooltip zIndex={2} comp={
						<div style={{maxWidth: 500, height: 'auto'}}>
							<img style={{height:'100%', width:'100%', objectFit:'contain'}}
								 src={text} alt="urlscan screenshot"/>
						</div>
					}>
						{aNode}
					</ComponentTooltip>
				);
			}

			return aNode;
		}

		// general elements
		return <p style={{color: color}}>{text}</p>
	})
}

export const jsonLines = (dictionary) => {
	
	let str = ''
	
	for (const key of Object.keys(dictionary)) {
		const text = toColorText(dictionary[key]).val
		
		if (text) str += `${key}: ${text}\n`
	}
	
	return str
}

const withLeadingZero = (num) => (num >= 10) ? num : '0' + num;
export const currentTimeStamp = () => { // TODO:
	const dateObj = new Date();
	
	return `${dateObj.getFullYear()}-${withLeadingZero(dateObj.getMonth() + 1)}-${withLeadingZero(dateObj.getDate())}_${
		withLeadingZero(dateObj.getHours())}-${
		withLeadingZero(dateObj.getMinutes())}-${
		withLeadingZero(dateObj.getSeconds())}`;
	//return dateObj.toString();
}
