import { Outlet } from "react-router-dom";

function App() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/v1/auth/google/";
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <div>
        <button
          onClick={handleGoogleLogin}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
        <Outlet />

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default App;
