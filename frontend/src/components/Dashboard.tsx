import { useEffect } from "react";
import { Notes } from "./Notes";

const Dashboard = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
    }
  }, []);

  return (
    <div className="text-4xl flex items-center justify-center">
      Redirecting... hhhh
      <Notes />
    </div>
  );
};

export default Dashboard;
