import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Callback from "./pages/Callback";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./panels/AdminPanel";
import SalonPanel from "./panels/SalonPanel";
import CustomerPanel from "./panels/CustomerPanel";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salon/*"
        element={
          <ProtectedRoute allowedRoles={["SALON_OWNER"]}>
            <SalonPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <CustomerPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
