import { BrowserRouter, HashRouter, Outlet, Route, Routes } from "react-router-dom";
import pages from "./pages";

import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import LoadingPage from "./components/LoadingPage";
import { Bot } from "lucide-react";
import { isElectron } from "./lib/utils";

const Router = isElectron ? HashRouter : BrowserRouter;

function Layout() {
    return (
        <main className="h-screen flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </main>
    );
}

function NotFound() {
    return (
        <div className="flex flex-col min-h-screen justify-center items-center">
            <Bot size={96} />
            <div className="text-5xl font-semibold">Page not found</div>
        </div>
    );
}

function App() {
    const { user, loading } = useAuth();

    console.log(user);

    if (loading) return <LoadingPage />;

    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    {pages.map(({ path, component: Component }) => (
                        <Route key={path} path={path} element={<Component />} />
                    ))}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
