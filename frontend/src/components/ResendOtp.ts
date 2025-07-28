import toast from "react-hot-toast";
import api from "./Api";

export const ResendOTP = async (email: string) => {
  try {
    const { data } = await api.put("user/resend-otp", { email });
    toast.success(data?.message);
    return data;
  } catch (error) {
    toast.error("Something went wrong!");
    console.log(error);
  }
};
