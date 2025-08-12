import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LockboxAssignPage from "./pages/LockboxAssignPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lockbox-assign" element={<LockboxAssignPage />} />
      </Routes>
    </BrowserRouter>
  );
}
