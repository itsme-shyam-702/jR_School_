import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Admissions from "./pages/Admissions";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import AdmissionDashboard from "./pages/AdmissionDashboard";
import InboxDashboard from "./pages/InboxDashboard";
import { Sidebar } from "lucide-react";

// ----------------------------
// ProtectedRoute component
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/" />; // redirect if not signed in
  }

  const userRole = user.publicMetadata.role || "visitor"; // default to visitor
  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/" />; // redirect if role not allowed
  }

  return children;
};

// ----------------------------
function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Sidebar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["staff", "admin"]}>
                <AdmissionDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute roles={["staff", "admin"]}>
                <InboxDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
