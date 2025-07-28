import { useEffect, useState } from "react";
import CreateNote from "./CreateNote";
import Notes from "./Notes";
import { getProfile } from "./Api";

const Dashboard = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [user, setUser] = useState<any>({});
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        localStorage.setItem("userId", JSON.stringify(data?.userId));
        setUser(data);
      } catch (error) {
        console.log("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleNoteCreated = () => {
    setRefreshFlag((prev) => !prev);
    setModal(false);
  };

  return (
    <div className="max-w-4xl bg-[#EEF2FF] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h2 className="text-2xl font-semibold mb-4 sm:mb-0">Notes</h2>
        <div className="flex items-center gap-4">
          <img
            src={
              user?.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user}`
            }
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <button
            onClick={handleLogout}
            className="text-blue-600 hover:underline font-medium text-sm sm:text-base"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg shadow-sm text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Welcome, {user?.name}!</h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Email: {user?.email}
        </p>
      </div>

      <button
        onClick={() => setModal(true)}
        className="w-full bg-[#4F39F6] hover:bg-blue-700 text-white py-3 rounded-md font-medium transition-colors duration-200"
      >
        Create Note
      </button>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✖
            </button>
            <h2 className="text-indigo-900 font-bold text-xl mb-4">
              Create Note
            </h2>
            <CreateNote onNoteCreated={handleNoteCreated} />
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="m-2">
        <Notes refreshTrigger={refreshFlag} />
      </div>
    </div>
  );
};

export default Dashboard;
