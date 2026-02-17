import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import pages from "./pages";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import About from "./pages/About";
import Apply from "./pages/Apply";
import Dashboard from "./pages/Dashboard";

function Layout() {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">
                <Outlet />
            </div>
        </main>
    );
}

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/apply" element={<Apply />} />
                    <Route path="/dashboard" element={<Dashboard />} />

                    {pages.map(({ path, component: Component }) => (
                        <Route key={path} path={path} element={<Component />} />
                    ))}
                </Route>
            </Routes>
        </HashRouter>
    );
}

export default App;