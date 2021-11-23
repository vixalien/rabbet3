import cn from "classnames";

let Checkbox = ({ label = "Checkbox", error, ...props }) => {
	props.type = props.type || "checkbox";
	return (
		<div className={cn("checkbox", { "has-error": error })}>
			<label>
				<input {...props} />
				{label}
			</label>
			{error && <div className="error">{error}</div>}
		</div>
	);
};

let Input = ({ label, error, info, ...props }) => {
	if (props.type == "checkbox" || props.type == "radio")
		return <Checkbox {...{ label, ...props }} />;
	return (
		<div className={"input"} hidden={props.type == "hidden"}>
			<label>
				{label && <div className="label">{label}</div>}
				<input type="text" {...props} />
			</label>
			{error && <div className="error">{error}</div>}
			{info && (
				<div className="info">
					<b>Info: </b>
					{info}
				</div>
			)}
			{info && error && <br />}
		</div>
	);
};

let Textarea = ({ label, error, info, ...props }) => {
	return (
		<div className={"input"}>
			<label>
				{label && <div className="label">{label}</div>}
				<textarea rows="5" {...props} />
			</label>
			{error && <div className="error">{error}</div>}
			{info && (
				<div className="info">
					<b>Info: </b>
					{info}
				</div>
			)}
			{info && error && <br />}
		</div>
	);
};

let Select = ({
	label,
	error,
	info,
	edit,
	placeholder,
	allowDefault = false,
	options = {},
	...props
}) => {
	return (
		<div className={cn("input", { "has-error": error })}>
			<label>
				{label && <div className="label">{label}</div>}
				<select {...props}>
					{placeholder && (
						<option disabled={!allowDefault} value="">
							{placeholder}
						</option>
					)}
					{Object.entries(options).map(([caption, id]) => {
						return (
							<option value={id} key={label + "-select-" + id}>
								{caption}
							</option>
						);
					})}
				</select>
			</label>
			{error && <div className="error">{error}</div>}
			{info && (
				<div className="info">
					<b>Info: </b>
					{info}
				</div>
			)}
			{info && error && <br />}
		</div>
	);
};

export default Input;

export { Textarea, Select, Checkbox };
