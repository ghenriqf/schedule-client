import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Ministries } from "./pages/Ministries";
import { CreateMinistry } from "./pages/CreateMinistry";
import { MinistryDashboard } from "./pages/MinistryDashboard";
import { AppLayout } from "./components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<AppLayout />}>
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/ministries/create" element={<CreateMinistry />} />
          <Route path="/ministries/:id" element={<MinistryDashboard />} />
          <Route
            path="/profile"
            element={
              <div className="p-8 text-slate-500">Perfil (em breve)</div>
            }
          />
        </Route>
        <Route path="/" element={<Navigate to="/ministries" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
