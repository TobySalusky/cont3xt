// https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react/44661948
export const downloadNamedTextFile = (name, contents) => {
	const element = document.createElement("a");
	const file = new Blob([contents], {type: 'text/plain'});
	element.href = URL.createObjectURL(file);
	element.download = `${name}.txt`;
	document.body.appendChild(element); // necessary for Firefox
	element.click();
}
