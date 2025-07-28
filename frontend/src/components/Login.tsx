import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./Api";
import toast from "react-hot-toast";
import LoadingButton from "./LoadingButton";
import { ResendOTP } from "./ResendOtp";

function Login() {
  const [isOtp, setIsOtp] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const [inputData, setInputData] = useState({
    username: "",
    email: "",
    otp: "",
  });
  const [error, setError] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const validateInput = () => {
    const newError: { [key: string]: string } = {};

    if (!inputData.email) {
      newError.email = "Email is required";
    }

    if (!isSignIn && !inputData.username) {
      newError.username = "Username is required";
    }

    if (isOtp && !inputData.otp) {
      newError.otp = "OTP is required";
    }

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInput()) return;
    setLoading(true);

    try {
      if (isSignIn) {
        const { email } = inputData;
        const { data } = await api.post("user/login", { email });
        toast.success(data?.message || "Login SuccessFully.");
        localStorage.setItem("token", data?.token);
        navigate("/dashboard");
      } else {
        if (isOtp) {
          const { email, otp } = inputData;
          const { data } = await api.post("user/verify-otp", { email, otp });
          localStorage.setItem("token", data?.token);
          toast.success(data?.message || "OTP Verified Successfully");
          navigate("/dashboard");
        } else {
          const { email, username } = inputData;
          const { data } = await api.post("user/register", {
            email,
            username,
          });
          toast.success(data?.message || "OTP sent to your email");
          setIsOtp(true);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
      setError({ form: err.response?.data?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/api/v1/auth/google/`;
  };

  const resendOtp = async () => {
    const { email } = inputData;
    setLoading(true);
    await ResendOTP(email);
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-4xl m-2 sm:m-6 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 p-4 sm:p-6">
          <div className="mt-8 flex flex-col items-center">
            <h1 className="text-xl xl:text-2xl font-extrabold">
              {isSignIn ? "Sign In" : "Sign Up"}
            </h1>
            <div className="w-full flex-1 mt-6">
              <div className="flex flex-col items-center">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full max-w-xs font-semibold text-sm shadow-sm rounded-lg py-2 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out hover:shadow"
                >
                  <div className="bg-white p-1.5 rounded-full">
                    <svg className="w-4" viewBox="0 0 533.5 544.3">
                      <path
                        fill="#4285f4"
                        d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                      />
                      <path
                        fill="#34a853"
                        d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                      />
                      <path
                        fill="#fbbc04"
                        d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                      />
                      <path
                        fill="#ea4335"
                        d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                      />
                    </svg>
                  </div>
                  <span className="ml-3">Sign Up with Google</span>
                </button>
              </div>

              <div className="my-8 border-b text-center">
                <div className="leading-none px-2 inline-block text-xs text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or sign up with e-mail
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mx-auto max-w-xs">
                  {!isSignIn && (
                    <>
                      <input
                        onChange={handleOnChange}
                        value={inputData.username}
                        className="w-full px-6 py-3 mb-1 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        type="text"
                        name="username"
                        placeholder="Username"
                      />
                      {error.username && (
                        <p className="text-red-500 text-xs mb-2">
                          {error.username}
                        </p>
                      )}
                    </>
                  )}

                  <input
                    onChange={handleOnChange}
                    value={inputData.email}
                    className="w-full px-6 py-3 mb-1 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    name="email"
                    placeholder="Email"
                  />
                  {error.email && (
                    <p className="text-red-500 text-xs mb-2">{error.email}</p>
                  )}

                  {isOtp && (
                    <>
                      <input
                        name="otp"
                        onChange={handleOnChange}
                        value={inputData.otp}
                        className="w-full px-6 py-3 mb-1 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        type="text"
                        placeholder="OTP"
                      />
                      {error.otp && (
                        <p className="text-red-500 text-xs mb-2">{error.otp}</p>
                      )}
                      <p className="cursor-pointer" onClick={resendOtp}>
                        Resend
                      </p>
                    </>
                  )}

                  {error.form && (
                    <p className="text-red-500 text-sm text-center mt-2">
                      {error.form}
                    </p>
                  )}
                  <LoadingButton
                    isLoading={loading}
                    text={isSignIn ? "Sign In" : isOtp ? "Sign Up" : "GET OTP"}
                  />

                  <p className="mt-5 text-xs text-gray-600 text-center">
                    I agree to abide by Templatana's{" "}
                    <a className="border-b border-gray-500 border-dotted cursor-pointer">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a className="border-b border-gray-500 border-dotted cursor-pointer">
                      Privacy Policy
                    </a>
                  </p>

                  <p className="mt-3 text-xs text-center">
                    {isSignIn ? (
                      <>
                        Don't have an account?{" "}
                        <button
                          className="text-indigo-600 underline"
                          type="button"
                          onClick={() => {
                            setIsSignIn(false);
                            setIsOtp(false);
                            setInputData({ username: "", email: "", otp: "" });
                            setError({});
                          }}
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button
                          className="text-indigo-600 underline"
                          type="button"
                          onClick={() => {
                            setIsSignIn(true);
                            setIsOtp(false);
                            setInputData({ username: "", email: "", otp: "" });
                            setError({});
                          }}
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex items-center justify-center">
          <div
            className="w-80 h-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://img.freepik.com/vecteurs-premium/illustration-du-concept-lettre_114360-27243.jpg')",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export { Login };
