import { Link } from "react-router-dom";
import { LayoutDashboard, FileSignature, Wrench } from "lucide-react";

export default function ManagerSidebar() {
    return (
        <aside className="w-64 border-r-2 h-[calc(100vh-4rem)] p-4 hidden md:block">
            
            <div className="flex flex-col gap-2">
                
                <Link 
                    to="/dashboard" 
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <LayoutDashboard size={20} />
                    <span className="font-bold">Portfolio Dashboard</span>
                </Link>

                <Link 
                    to="/applications" 
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <FileSignature size={20} />
                    <span className="font-bold">Pending Applications</span>
                </Link>

                <Link 
                    to="/tickets" 
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <Wrench size={20} />
                    <span className="font-bold">Maintenance Tickets</span>
                </Link>

            </div>
            
        </aside>
    );
}