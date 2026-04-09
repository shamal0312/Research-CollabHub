import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const linkClass = (path) =>
    `cursor-pointer transition ${
      location.pathname === path
        ? "text-black font-bold underline underline-offset-4" // ✅ TEXT ONLY
        : "text-gray-500 hover:text-black"
    }`;

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-xl px-8 py-4 flex justify-between items-center border-b border-gray-200">
      
      {/* LEFT */}
      <h1 
        className="text-2xl font-bold text-black cursor-pointer tracking-wide hover:scale-105 transition-transform"
        onClick={() => navigate("/home")}
      >
        Research CollabHub
      </h1>

      {/* RIGHT */}
      <nav className="flex space-x-6 font-medium">

        <span onClick={() => navigate("/home")} className={linkClass("/home")}>
          Home
        </span>

        <span onClick={() => navigate("/projects")} className={linkClass("/projects")}>
          Projects
        </span>

        <span onClick={() => navigate("/workspace")} className={linkClass("/workspace")}>
          Workspace
        </span>

        <span onClick={() => navigate("/profile")} className={linkClass("/profile")}>
          Profile
        </span>

      </nav>
    </header>
  );
};

export default Header;