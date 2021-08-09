/*
ex.
list = ['a', 'b', 'c', 'd', 'e']
orderList = ['c', 'b', 'a']

==> ['c', 'b', 'a', 'd', 'e']
 */
export function mapOrder(list, orderList) {
	return list.filter(val => orderList.indexOf(val) !== -1).sort((a, b) => {
		return (orderList.indexOf(a) > orderList.indexOf(b)) ? 1 : -1;
	}).concat(list.filter(val => orderList.indexOf(val) === -1));
}

export function onEnd(list, endList) {
	const start = list.filter(val => endList.indexOf(val) === -1);
	const end = list.filter(val => endList.indexOf(val) !== -1);
	return start.concat(end);
}


const FULL_CONV = {lastSeen: 'fullLastSeen', firstSeen: 'fullFirstSeen'}
export const sortPassiveDNSResults = (resultList, thisSortType) => {
	const sortBy = FULL_CONV[thisSortType];
	return resultList.sort((a, b) => new Date(b[sortBy]) - new Date(a[sortBy]));
}

export const sortUrlScanResults = (resultList, thisSortType) => {
	const dateFromResult = (result) => new Date(result.task.time);
	const sorted = resultList.sort((a,b) => dateFromResult(a) - dateFromResult(b));
	if (thisSortType === DESCENDING) return sorted;
	return sorted.reverse();
}

export const sortVirusTotalResults = (resultList, thisSortType) => {
	const dateFromResult = (result) => new Date(result.date ?? result.scan_date ?? result.last_resolved);
	const sorted = resultList.sort((a,b) => dateFromResult(a) - dateFromResult(b));
	if (thisSortType === DESCENDING) return sorted;
	return sorted.reverse();
}

export const LAST_SEEN = 'lastSeen', FIRST_SEEN = 'firstSeen';
export const ASCENDING = 'ascend', DESCENDING = 'descend';