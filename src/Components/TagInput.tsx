import React, {useState} from "react";

export const TagInput: React.FC<{tags: string[], setTags: React.Dispatch<string[]>}> = ({tags, setTags}) => {

    const validateTag = (tag: string) => {
        return tag !== '';
    }

    const [text, setText] = useState('');

    const enterPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const code = e.keyCode || e.which;
        if (text === '') return;
        if (code === 13) { //13 is the enter keycode
            setTags(tags.concat(text.split(',').map(tag => tag.trim()).filter(validateTag)));
            setText('');
        }
    }

    return (
        <input className="TagBar" type="text" placeholder='tags:' value={text} onChange={e => setText(e.target.value)} onKeyPress={enterPressed}/>
    );
}
