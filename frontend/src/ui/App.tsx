import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import pages from "./pages";

import Navbar from "./components/Navbar";
import ManagerNavbar from "./components/ManagerNavbar";
import ManagerSidebar from "./components/ManagerSidebar";
import ApplicantNavbar from "./components/ApplicantNavbar";
import ReceptionistNavbar from "./components/ReceptionistNavbar";
import ReceptionistSidebar from "./components/ReceptionistSidebar";
import StaffNavbar from "./components/StaffNavbar"; 

import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import About from "./pages/About";
import Home from "./pages/Home"; 
import Apply from "./pages/Apply";

import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Application";
import Tickets from "./pages/Tickets";

import GuestList from "./pages/Guestlist";
import WalkIn from "./pages/Walkin";
import Receptionist from "./pages/Receptionist";
import UploadGuide from "./pages/Guide";
import StaffTasks from "./pages/StaffTasks"; 
import StaffGuide from "./pages/Staffguide";
import GuestPortal from "./pages/GuestPortal";

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

function ApplicantLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <ApplicantNavbar />
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
}

function ReceptionistLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <ReceptionistNavbar />
            <div className="flex flex-1">
                <ReceptionistSidebar />
                <main className="flex-1 bg-slate-50 dark:bg-slate-950 p-4">
                    <Outlet />
                </main>
            </div>
        </div>
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

function StaffLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <StaffNavbar />
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
}

function GuestLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <Navbar /> 
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
}

function App() {
    return (
        <HashRouter>
            <Routes>
                
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/about" element={<About />} />
                    
                    {pages.map(({ path, component: Component }) => (
                        <Route key={path} path={path} element={<Component />} />
                    ))}
                </Route>

                <Route element={<ApplicantLayout />}>
                    <Route path="/apply" element={<Apply />} />
                    <Route path="/guide" element={<UploadGuide />} />
                </Route>

                <Route element={<ReceptionistLayout />}>
                    <Route path="/receptionist" element={<Receptionist />} />
                    <Route path="/guests" element={<GuestList />} />
                    <Route path="/walkin" element={<WalkIn />} />
                </Route>

                <Route element={<ManagerLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/applications" element={<Applications />} />
                    <Route path="/tickets" element={<Tickets />} />
                </Route>

                <Route element={<StaffLayout />}>
                    <Route path="/stafftasks" element={<StaffTasks />} />
                    <Route path="/staffguide" element={<StaffGuide />} />
                </Route>

                <Route element={<GuestLayout />}>
                    <Route path="/guestportal" element={<GuestPortal />} />
                </Route>

            </Routes>
        </HashRouter>
    );
}

export default App;