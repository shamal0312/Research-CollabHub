import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile"; // ✅ ADDED
import Projects from "./pages/Projects"; // ✅ ADDED
import Workspace from "./pages/Workspace"; // ✅ ADDED
import EditProfile from "./pages/EditProfile"; // ✅ ADDED
import PublicProfile from "./pages/PublicProfile"; // ✅ ADDED
import WorkspaceDetails from "./pages/WorkspaceDetails"; // ✅ ADDED
import Messages from "./pages/Messages"; // ✅ ADDED
import CreatePortfolio from "./pages/CreatePortfolio"; // ✅ ADDED
import PortfolioView from "./pages/PortfolioView"; // ✅ ADDED
import WorkspaceDocuments from "./pages/WorkspaceDocuments"; // ✅ ADDED
import WorkspaceMeetings from "./pages/WorkspaceMeetings"; // ✅ ADDED
import WorkspaceTasks from "./pages/WorkspaceTasks"; // ✅ ADDED
import WorkspaceTaskDetails from "./pages/WorkspaceTaskDetails"; // ✅ ADDED
import WorkspaceChat from "./pages/WorkspaceChat"; // ✅ ADDED
import PortfolioContact from "./pages/PortfolioContact"; // ✅ ADDED
import PortfolioCertificates from "./pages/PortfolioCertificates"; // ✅ ADDED
import PortfolioSkills from "./pages/PortfolioSkills"; // ✅ ADDED
import PortfolioResults from "./pages/PortfolioResults"; // ✅ ADDED
import PortfolioProjects from "./pages/PortfolioProjects"; // ✅ ADDED
import AdminResults from "./pages/AdminResults"; // ✅ ADDED
import AdminDashboard from "./pages/AdminDashboard"; // ✅ ADDED


import AdminRoute from "./components/AdminRoute";


import { useAuth } from "./context/AuthContext";

// 🔒 Protected Route
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* default */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:id" element={<PublicProfile />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/portfolio/:slug" element={<PortfolioView />} />
        <Route path="/workspace/:workspaceId/meetings" element={<WorkspaceMeetings />} />
        <Route path="/workspace/:workspaceId/tasks" element={<WorkspaceTasks />} />
        <Route path="/workspace/:workspaceId/tasks/:taskId" element={<WorkspaceTaskDetails />}/>
        <Route path="/workspace/:workspaceId/messages" element={<WorkspaceChat />}/>
        <Route path="/portfolio/:slug/contact" element={<PortfolioContact />} />
        <Route path="/portfolio/:slug/certificates" element={<PortfolioCertificates />} />
        <Route path="/portfolio/:slug/skills" element={<PortfolioSkills />} />
        <Route path="/portfolio/:slug/results" element={<PortfolioResults />} />
        <Route path="/portfolio/:slug/projects" element={<PortfolioProjects />} />
 
        


        <Route
           path="/admin/dashboard"
           element={
             <AdminRoute>
               <AdminDashboard />
             </AdminRoute>
           }
       />

<Route
  path="/admin/results"
  element={
    <AdminRoute>
      <AdminResults />
    </AdminRoute>
  }
/>
         
        


        {/* ✅ ADDED WORKSPACE DETAILS ROUTE */}
        <Route
          path="/workspace/:workspaceId"
          element={
            <PrivateRoute>
              <WorkspaceDetails />
            </PrivateRoute>
          }
        />

        {/* ✅ ADDED MESSAGES ROUTE */}
        <Route
          path="/messages/:userId"
          element={
            <PrivateRoute>
              <Messages />
            </PrivateRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <Messages />
            </PrivateRoute>
         }
       />

       <Route
         path="/create-portfolio"
         element={
           <PrivateRoute>
             <CreatePortfolio />
           </PrivateRoute>
         }
      />

      

      

      <Route
        path="/workspace/:workspaceId/documents"
        element={<WorkspaceDocuments />}
     />

        {/* 🔐 Protected */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* ✅ ADDED ROUTES */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />

        <Route
          path="/workspace"
          element={
            <PrivateRoute>
              <Workspace />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;