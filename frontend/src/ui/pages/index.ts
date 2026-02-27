import type { ReactNode } from "react";
import type { NavbarView } from "@/components/Navbar";

import About from "./About";
import Home from "./Home";
import LoginPage from "./login";
import Test from "./Test";
import StaffTasks from "./StaffTasks";
import Receptionist from "./Receptionist";
import SignupPage from "./signup";
import Dashboard from "./Dashboard";
import Applications from "./Application";
import Tickets from "./Tickets";
import MyBuildingGroups from "./building-group/MyBuildingGroups";
import BuildingGroup from "./building-group/BuildingGroup";
import GuestPortal from "./GuestPortal";
import Building from "./building/Building";

type Page = {
    path: string;
    title: string;
    component: () => ReactNode;
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
        path: "/staff",
        title: "Staff Dashboard",
        component: StaffTasks,
        navbarView: ["Staff"],
    },
    {
        path: "/receptionist",
        title: "Receptionist Dashboard",
        component: Receptionist,
        navbarView: ["Staff"],
    },
    {
        path: "/building-groups",
        title: "My Portfolio",
        component: MyBuildingGroups,
        navbarView: ["Manage"],
    },
    {
        path: "/dashboard",
        title: "Manager Dashboard",
        component: Dashboard,
        navbarView: ["Manage"],
    },
    {
        path: "/applications",
        title: "Applications",
        component: Applications,
        navbarView: ["Manage"],
    },
    {
        path: "/tickets",
        title: "Tickets",
        component: Tickets,
        navbarView: ["Manage"],
    },
    {
        path: "/test",
        title: "Test",
        component: Test,
        navbarView: ["Guest", "Staff", "Manage"],
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
] as const;

export default pages;

export const pagesLinks = pages.map(({ path, title, navbarView }) => ({
    path,
    title,
    navbarView,
}));
