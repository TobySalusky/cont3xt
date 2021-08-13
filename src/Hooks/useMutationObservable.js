import { useContext, useEffect, useState } from 'react';
import { MutationContext } from '../State/MutationContext';

// source: https://blog.logrocket.com/guide-to-custom-react-hooks-with-mutationobserver/

const DEFAULT_OPTIONS = {
	config: { attributes: true, childList: true, subtree: true },
};
export function useMutationObservable(targetEl, cb, options = DEFAULT_OPTIONS) {
	const [observer, setObserver] = useState(null);
	
	useEffect(() => {
		const obs = new MutationObserver(cb);
		setObserver(obs);
	}, [cb, options, setObserver]);
	
	useEffect(() => {
		if (!observer) return;
		const { config } = options;
		observer.observe(targetEl, config);
		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	}, [observer, targetEl, options]);
}