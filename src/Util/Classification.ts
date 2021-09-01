import {IndicatorData} from "../Types/Types";
import {ISubTypes, ITypes} from "../Enums/ITypes";

export const classificationObj = (indicatorVal: string): IndicatorData => {

	const ipRegex = require('ip-regex');
	const urlRegex = require('url-regex-safe');

	const typeValidation = {
		phone: /^(\d{3})[-. ]?(\d{3})[-. ]?(\d{4})$/,
		domain: /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/, //TODO: don't accept hyphen as first or last
		email: /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-](\.?[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-])+@([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)$/,
		//ip: /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
		MD5: /^[A-Fa-f0-9]{32}$/,
		SHA1: /^[A-Fa-f0-9]{40}$/,
		SHA256: /^[A-Fa-f0-9]{64}$/,
	}

	let type = ITypes.Text;
	let subType = ISubTypes.NONE;
	if (typeValidation.phone.test(indicatorVal)) type = ITypes.PhoneNumber
	else if (ipRegex.v4({exact: true}).test(indicatorVal)) {
		type = ITypes.IP;
		subType = ISubTypes.IPv4;
	}
	else if (ipRegex.v6({exact: true}).test(indicatorVal)) {
		type = ITypes.IP;
		subType = ISubTypes.IPv6;
	}
	else if (typeValidation.email.test(indicatorVal)) type = ITypes.Email;
	else if (typeValidation.domain.test(indicatorVal)) type = ITypes.Domain;
	else if (urlRegex({exact: true}).test(indicatorVal)) type = ITypes.Url;
	else if (typeValidation.MD5.test(indicatorVal)) {
		type = ITypes.Hash;
		subType = ISubTypes.MD5;
	}
	else if (typeValidation.SHA1.test(indicatorVal)) {
		type = ITypes.Hash;
		subType = ISubTypes.SHA1;
	}
	else if (typeValidation.SHA256.test(indicatorVal)) {
		type = ITypes.Hash;
		subType = ISubTypes.SHA256;
	}



	return {value: indicatorVal, type, subType,
		stringify: function() {
			return `${this.type}${this.subType !== ISubTypes.NONE ? `(${this.subType})` : ''}: ${this.value}`;
		}
	};
}
