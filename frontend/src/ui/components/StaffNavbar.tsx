import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function StaffNavbar() {
  return (
    <nav className="h-16 border-b-2 flex items-center justify-between px-4">
      
      <div className="text-2xl font-bold flex items-center gap-2">
        Autocoderz <span className="text-sm font-normal text-slate-500 border-l-2 pl-2">Staff Portal</span>
      </div>

      <NavigationMenu>
        <NavigationMenuList>
          
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/stafftasks">My Mobile Tasks</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/staffguide">Upload Guide</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/test">Test</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-4">
        <Button asChild variant="outline">
          <Link to="/">Logout</Link>
        </Button>
        <ThemeToggle />
      </div>
    </nav>
  );
}