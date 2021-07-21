export function InlineDiv({children, style}) {
	return (
		<div className="Inline" style={style}>
			{children}
		</div>
	);
}

export function InlineRightDiv({children, style}) {
	return (
		<div className="InlineRight" style={style}>
			{children}
		</div>
	);
}
