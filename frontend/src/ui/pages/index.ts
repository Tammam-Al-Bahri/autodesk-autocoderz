import { lazy } from "react";
import type { NavbarView } from "@/components/Navbar";
import type { ComponentType } from "react";

const About = lazy(() => import("./About"));
const Home = lazy(() => import("./Home"));
const LoginPage = lazy(() => import("./login"));
// const StaffTasks = lazy(() => import("./StaffTasks"));
// const Receptionist = lazy(() => import("./Receptionist"));
const SignupPage = lazy(() => import("./signup"));
const Dashboard = lazy(() => import("./Dashboard"));
const Applications = lazy(() => import("./Application"));
const Tickets = lazy(() => import("./Tickets"));
const MyBuildingGroups = lazy(() => import("./building-group/MyBuildingGroups"));
const BuildingGroup = lazy(() => import("./building-group/BuildingGroup"));
const GuestPortal = lazy(() => import("./GuestPortal"));
const Building = lazy(() => import("./building/Building"));
const MyJobs = lazy(() => import("./staff/MyJobs"));
const StaffJobDashboard = lazy(() => import("./staff/StaffJobDashboard"));
const Profile = lazy(() => import("./user/Profile.tsx"));

type Page = {
    path: string;
    title: string;
    component: ComponentType;
    navbarView?: NavbarView[];
};

const pages: Page[] = [
    {
        path: "/",
        title: "Home",
        component: Home,
    },
    {
        path: "/login",
        title: "Login",
        component: LoginPage,
    },
    {
        path: "/signup",
        title: "Sign Up",
        component: SignupPage,
    },
    {
        path: "/about",
        title: "About",
        component: About,
        navbarView: ["Guest"],
    },
    {
        path: "/guestportal",
        title: "Guest Portal",
        component: GuestPortal,
        navbarView: ["Guest"],
    },
    {
        path: "/jobs",
        title: "My Jobs",
        component: MyJobs,
        navbarView: ["Staff"],
    },
    {
        path: "/jobs/:buildingId",
        title: "Building",
        component: StaffJobDashboard,
    },
    // {
    //     path: "/staff",
    //     title: "Staff Dashboard",
    //     component: StaffTasks,
    //     navbarView: ["Staff"],
    // },
    // {
    //     path: "/receptionist",
    //     title: "Receptionist Dashboard",
    //     component: Receptionist,
    //     navbarView: ["Staff"],
    // },
    {
        path: "/building-groups",
        title: "My Portfolio",
        component: MyBuildingGroups,
        navbarView: ["Manager"],
    },
    {
        path: "/dashboard",
        title: "Manager Dashboard",
        component: Dashboard,
        // navbarView: ["Manager"],
    },
    {
        path: "/applications",
        title: "Applications",
        component: Applications,
        // navbarView: ["Manager"],
    },
    {
        path: "/tickets",
        title: "Tickets",
        component: Tickets,
        // navbarView: ["Manager"],
    },
    {
        path: "/building-groups/:buildingGroupId",
        title: "Company",
        component: BuildingGroup,
    },
    {
        path: "/building-groups/:buildingGroupId/buildings/:buildingId",
        title: "Building",
        component: Building,
    },
    {
        path: "/profile",
        title: "Profile",
        component: Profile,
    },
] as const;

export default pages;

export const pagesLinks = pages.map(({ path, title, navbarView }) => ({
    path,
    title,
    navbarView,
}));
