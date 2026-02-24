import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { MinistriesPage } from "./pages/MinistriesPage";
import { CreateMinistryPage } from "./pages/CreateMinistryPage";
import { MinistryDashboardPage } from "./pages/MinistryDashboardPage";
import { AppLayout } from "./components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<AppLayout />}>
          <Route path="/ministries" element={<MinistriesPage />} />
          <Route path="/ministries/create" element={<CreateMinistryPage />} />
          <Route path="/ministries/:id" element={<MinistryDashboardPage />} />
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
