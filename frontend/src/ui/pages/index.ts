import Home from "./Home";
import Test from "./Test";

const pages = [
    {
        path: "/",
        title: "Home",
        component: Home,
    },
    {
        path: "/test",
        title: "Test",
        component: Test,
    },
] as const;

export default pages;
