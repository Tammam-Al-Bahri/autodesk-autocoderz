import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import pages from "./pages";
import { ThemeToggle } from "./components/theme-toggle";

function Layout() {
    return (
        <main className="border-red-500 border-8">
            <ThemeToggle />
            <Outlet />
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
