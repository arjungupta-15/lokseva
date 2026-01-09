import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Complaints from "./pages/Complaints";
import ComplaintDetails from "./pages/ComplaintDetails";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <PrivateRoute>
              <Complaints />
            </PrivateRoute>
          }
        />

        <Route
          path="/complaints/:id"
          element={
            <PrivateRoute>
              <ComplaintDetails />
            </PrivateRoute>
          }
        />

        {/* Default route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
