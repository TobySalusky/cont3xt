import ReactDOM from 'react-dom';

function Portal(props) {
	return ReactDOM.createPortal(props.children, document.body);
}
export default Portal;