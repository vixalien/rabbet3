import toast, { Toaster } from "react-hot-toast";

let exportedToast = {
	default: toast,
	error: toast.error,
	success: toast.success,
	loading: toast.loading,
	dismiss: toast.dismiss,
	promise: toast.promise,
	clear: toast.remove,
};

let ToastComponent = () => {
	return (
		<Toaster
			position="bottom-center"
			reverseOrder={true}
			toastOptions={{
				style: {
					padding: "5px 10px",
					fontSize: "16px",
					border: "1px solid",
				},
				error: {
					style: {
						border: "1px solid #ff4c4c",
					},
				},
				success: {
					style: {
						border: "1px solid #2c9213",
					},
				},
			}}
		/>
	);
};

export default exportedToast;

export { ToastComponent };
