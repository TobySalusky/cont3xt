import ComponentTooltip from "../Components/ComponentTooltip";
import {isArray, isDict} from "./VariableClassifier";
import React from "react";

// source: https://stackoverflow.com/questions/10599933/convert-long-number-into-abbreviated-string-in-javascript-with-a-special-shortn
export const abbreviateNumber = (value: number): string => {
	let newValue : any = value;
	if (value >= 1000) {
		const suffixes = ["", "k", "m", "b","t"];
		const suffixNum = Math.floor( (""+value).length/3 );
		let shortValue: any;
		for (let precision = 2; precision >= 1; precision--) {
			shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
			const dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
			if (dotLessShortValue.length <= 2) { break; }
		}
		if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
		newValue = shortValue+suffixes[suffixNum];
	}
	return newValue;
}


export const stripTrailingPeriod = (str : string) => {
	if (str.lastIndexOf('.') === str.length - 1) return str.substring(0, str.length - 1);
	return str;
}

const DEBUG = true; // Enable/Disable logging

export function log(...params : any){
	if(DEBUG){
		console.log.apply(console, params);
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
	null: '#b1b1b1',
	malicious: '#ff5050',
	dnsType: 'lightgreen',
}

export const trySnipDate = (timestamp: string): string => {
	try {
		const tIndex = timestamp.indexOf('T');
		const spaceIndex = timestamp.indexOf(' ');
		if ((tIndex < spaceIndex && tIndex !== -1) || spaceIndex === -1) {
			return makeUnbreakable(timestamp.substr(0, tIndex));
		}
		return makeUnbreakable(timestamp.substr(0, spaceIndex));
	} catch {
		return timestamp;
	}
}

export const toColorTextOld = (variable : any, brackets = true, appendComma = false, spaces = true) : any => {

	try {
		let returnVar = undefined;
		let colorData = [];

		if (isDict(variable)) {
			let str = '';
			if (brackets) {
				str += '{';
				colorData.push([typeColors.brackets, 1]);
			}

			let init = true
			for (const key of Object.keys(variable)) {

				let entry = toColorTextOld(variable[key])
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

		} else if (isArray(variable)) {

			let str = '';
			if (brackets) {
				str += '[';
				colorData.push([typeColors.brackets, 1]);
			}

			let init = true
			for (const element of variable) {
				let entry = toColorTextOld(element)
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


const fullText =  (colorData : Array<[string, string]>) => {
	return colorData.map(entry => entry[1]).join();
}

interface ColorTextSettings {
	brackets? : boolean;
	appendComma? : boolean;
	spaces? : boolean;
	multiline? : boolean;
}

export const toColorText = (variable : any, settings : ColorTextSettings = {}) : ColorDataObj => {

	const {brackets = true, appendComma = false, spaces = true, multiline = true} = settings;

	//const emptyDict = colorData => colorData.length === 2 && fullText(colorData) === '{}';
	//const emptyArr = colorData => colorData.length === 2 && fullText(colorData) === '[]';

	const tabIn = (colorData : Array<[string, string]>) => {
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
		let colorData : Array<[string, string]> = [];

		const commaStr = spaces ? ', ' : ',';
		const sep = spaces ? ': ' : ':';

		const breakLine = (data : Array<[string, string]>) => {
			if (multiline) data.push(['red', '\n']);
		}

		if (isDict(variable)) {
			if (brackets) {
				colorData.push([typeColors.brackets, '{']);
				breakLine(colorData);
			}

			let innerColorData : Array<[string, string]> = [];

			let init = true
			for (const key of Object.keys(variable)) {

				let entry = toColorText(variable[key], settings)

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

			//if (emptyDict(colorData)) return null;

		} else if (isArray(variable)) {

			if (brackets) {
				colorData.push([typeColors.brackets, '[']);
			}

			let init = true
			for (const element of variable) {
				const entry : ColorDataObj = toColorText(element, settings)

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

			//if (emptyArr(colorData)) return null;
		} else {
			let col = typeColors.plain;
			if (typeof variable === "boolean"){
				col = typeColors.boolean;
			} else if (typeof variable === "number") {
				col = typeColors.number;
			} else if (typeof variable === "string") {
				col = typeColors.string;
			} else if (variable === null) {
				col = typeColors.null;
			}
			colorData.push([col, '' + variable])
		}

		if (appendComma) {
			colorData.push([typeColors.comma, ',']);
		}

		return new ColorDataObj(colorData);

	} catch (e) {
		console.log(e)
		const failureMessage = 'FAILED_TO_PARSE';
		return new ColorDataObj([['red', failureMessage]]);
	}
}

class ColorDataObj {
	data : Array<[string, string]>;

	constructor(data : Array<[string, string]>) {
		this.data = data;
	}

	genText = () : string => fullText(this.data);
}

export const countColorDataLines = (colorData : ColorDataObj): number => {
	let i = 0;
	for (const colorDataEntry of colorData.data) {
		if (colorDataEntry[1] === '\n') {
			i++;
		}
	}
	return i + 1;
}

export const toColorElemsMultiline = (colorData : ColorDataObj) => {
	const list : any = [[]];

	for (const colorDataEntry of colorData.data) {
		if (colorDataEntry[1] === '\n') {
			list.push([])
		} else {
			list[list.length - 1].push(colorDataEntry);
		}
	}

	return (
		<div style={{display: 'flex', flexDirection: 'column'}}>
			{list.map((data : any) => new ColorDataObj(data)).map((dataObj : ColorDataObj) =>
				<span style={{display: 'flex', flexDirection: 'row', flexWrap: "wrap",}}>
					{toColorElems(dataObj)}
				</span>
			)}
		</div>
	);
}

export const makeUnbreakable = (str : string) => {
	if (typeof str !== 'string') return str;
	return str.replaceAll('-', '‑').replaceAll(' ', '\xa0');
}

export const makeColorElems = (variable : any) : JSX.Element[] => {
	return toColorElems(toColorText(variable));
}

export const makeClickableLink = (linkStr : string, displayText : string | null = null) : JSX.Element => {
	const aNode = (
		<a href={linkStr} target="_blank" rel="noreferrer" style={{color: typeColors.link, textDecoration: 'none'}}>
			{displayText ?? linkStr}
		</a>
	);

	if (linkStr.endsWith('.png')) {
		// @ts-ignore
		return (
			<ComponentTooltip zIndex={2} comp={
				<div style={{maxWidth: 500, height: 'auto'}}>
					<img style={{height:'100%', width:'100%', objectFit:'contain'}}
						 src={linkStr} alt="urlscan screenshot"/>
				</div>
			}>
				{aNode}
			</ComponentTooltip>
		);
	}

	return aNode;
}

export const toColorElems = (colorData : ColorDataObj) : JSX.Element[] => {

	return colorData.data.map(([color, text]) => {
		text = text.replaceAll(' ', '\xa0')

		// links
		if (text.startsWith('http://') || text.startsWith('https://')) {
			return makeClickableLink(text);
		}

		// general elements
		return <p style={{color: color, whiteSpace: 'pre-wrap'}}>{text}</p>
	})
}

export const jsonLines = (dictionary : any) => {

	let str = ''

	for (const key of Object.keys(dictionary)) {
		const text = toColorTextOld(dictionary[key]).val

		if (text) str += `${key}: ${text}\n`
	}

	return str;
}

const withLeadingZero = (num : number) => (num >= 10) ? num : '0' + num;

export const currentTimeStamp = () => { // TODO:
	return createTimeStamp(new Date(), true);
}

export const createTimeStamp = (date: Date, precise: boolean = false) => {
	return `${date.getFullYear()}-${withLeadingZero(date.getMonth() + 1)}-${withLeadingZero(date.getDate())}${precise ? `_${
		withLeadingZero(date.getHours())}-${
		withLeadingZero(date.getMinutes())}-${
		withLeadingZero(date.getSeconds())}` : ''}`;
}
