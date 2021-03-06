function fallbackCopyTextToClipboard(text) {
	var textArea = document.createElement("textarea");
	textArea.value = text;

	// Avoid scrolling to bottom
	textArea.style.top = "0";
	textArea.style.left = "0";
	textArea.style.position = "fixed";

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		var successful = document.execCommand("copy");
		var msg = successful ? "successful" : "unsuccessful";
		console.log("Fallback: Copying text command was " + msg);
	} catch (err) {
		console.error("Fallback: Oops, unable to copy", err);
	}

	document.body.removeChild(textArea);
}

function copy(text) {
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text);
		return;
	}
	navigator.clipboard.writeText(text);
}

async function copyButton(event) {
	let beforeText = event.target.innerHTML;
	event.preventDefault();
	try {
		copy(event.target.href);
		event.target.innerHTML = "Copied!";
	} catch (err) {
		event.target.innerHTML = "Couldn't copy content!";
		event.target.classList.add("delete");
		console.log("Couldn't copy to clipboard: " + err);
	} finally {
		setTimeout(() => {
			event.target.classList.remove("delete");
			event.target.innerHTML = beforeText;
		}, 2000);
	}
}

export default copy;
export { copyButton };
