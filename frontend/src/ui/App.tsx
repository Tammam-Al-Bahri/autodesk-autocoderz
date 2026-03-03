import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import pages from "./pages";

import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import LoadingPage from "./components/LoadingPage";

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
    const { user, loading } = useAuth();

    console.log(user);

    if (loading) return <LoadingPage />;

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    {pages.map(({ path, component: Component }) => (
                        <Route key={path} path={path} element={<Component />} />
                    ))}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
