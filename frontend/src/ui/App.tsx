import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import pages from "./pages";

import Navbar from "./components/Navbar";
import ManagerNavbar from "./components/ManagerNavbar";
import ManagerSidebar from "./components/ManagerSidebar";

import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import About from "./pages/About";
import Apply from "./pages/Apply";
import Dashboard from "./pages/Dashboard";

function PublicLayout() {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">
                <Outlet />
            </div>
        </main>
    );
}

function ManagerLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <ManagerNavbar />
            <div className="flex flex-1">
                <ManagerSidebar />
                <main className="flex-1 bg-slate-50 dark:bg-slate-950 p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

function App() {
    return (
        <HashRouter>
            <Routes>
                
                <Route element={<PublicLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/apply" element={<Apply />} />

                    {pages.map(({ path, component: Component }) => (
                        <Route key={path} path={path} element={<Component />} />
                    ))}
                </Route>

                <Route element={<ManagerLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>

            </Routes>
        </HashRouter>
    );
}

export default App;