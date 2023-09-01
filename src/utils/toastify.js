import { toast } from "react-toastify";

export const notify = (message, success) => {
  
  if (success) {
    return toast.success(message, { autoClose: 1000 });
  } else {
    
    return toast.error(message, { autoClose: 1000 });
  }
};