export function loadTxt(relPath) {
    fetch(relPath).then(r => r.text()).then(text => {
        return text;
    });
}