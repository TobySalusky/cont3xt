export const classificationObj = (indicatorVal) => {
	
	const ipRegex = require('ip-regex');
	
	const typeValidation = {
		phone: /^(\d{3})[-. ]?(\d{3})[-. ]?(\d{4})$/,
		domain: /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/, //TODO: don't accept hyphen as first or last
		email: /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-](\.?[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-])+@([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)$/,
		//ip: /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
		MD5: /^[A-Fa-f0-9]{32}$/,
		SHA1: /^[A-Fa-f0-9]{40}$/,
		SHA256: /^[A-Fa-f0-9]{64}$/,
	}
	
	let type = 'Text';
	let subType = 'None';
	if (typeValidation.phone.test(indicatorVal)) type = 'PhoneNumber'
	else if (ipRegex.v4({exact: true}).test(indicatorVal)) {
		type = 'IP';
		subType = 'IPv4';
	}
	else if (ipRegex.v6({exact: true}).test(indicatorVal)) {
		type = 'IP';
		subType = 'IPv6';
	}
	else if (typeValidation.email.test(indicatorVal)) type = 'Email'
	else if (typeValidation.domain.test(indicatorVal)) type = 'Domain'
	else if (typeValidation.MD5.test(indicatorVal)) {
		type = 'Hash';
		subType = 'MD5'
	}
	else if (typeValidation.SHA1.test(indicatorVal)) {
		type = 'Hash';
		subType = 'SHA1'
	}
	else if (typeValidation.SHA256.test(indicatorVal)) {
		type = 'Hash';
		subType = 'SHA256'
	}
	
	
	
	return {value: indicatorVal, type, subType,
		stringify: function() {
			return `${this.type}${this.subType !== 'None' ? `(${this.subType})` : ''}: ${this.value}`;
		}
	};
}
