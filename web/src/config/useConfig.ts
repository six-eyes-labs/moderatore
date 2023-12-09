import { ToastOptions } from "react-toastify";

const getConfig = () => {
  const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID!;

  const toastConfig: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  return {
    projectId,
    toastConfig,
  };
};
export default getConfig;
