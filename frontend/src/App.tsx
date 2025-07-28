import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <div className="bg-[#EEF2FF]">
        <Outlet />
      </div>
    </>
  );
}

export default App;
