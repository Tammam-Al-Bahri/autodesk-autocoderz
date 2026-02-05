import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import pages from "./pages";
import Navbar from "./components/Navbar";

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
                    {pages.map(({ path, component: Component }) => (
                        <Route key={path} path={path} element={<Component />} />
                    ))}
                </Route>
            </Routes>
        </HashRouter>
    );
}

export default App;
