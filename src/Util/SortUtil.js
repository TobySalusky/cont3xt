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


const FULL_CONV = {lastSeen: 'fullLastSeen', firstSeen: 'fullFirstSeen'}
export const sortPassiveDNSResults = (resultList, thisSortType) => {
	const sortBy = FULL_CONV[thisSortType];
	return resultList.sort((a, b) => new Date(b[sortBy]) - new Date(a[sortBy]));
}
export const LAST_SEEN = 'lastSeen', FIRST_SEEN = 'firstSeen';
