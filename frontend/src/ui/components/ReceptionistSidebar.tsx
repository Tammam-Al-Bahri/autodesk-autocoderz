import { Link } from "react-router-dom";
import { Grid, Users, UserPlus } from "lucide-react";

export default function ReceptionistSidebar() {
    return (
        <aside className="w-64 border-r-2 h-[calc(100vh-4rem)] p-4 hidden md:block bg-white dark:bg-slate-950">
            
            <div className="flex flex-col gap-2">
                
                <Link 
                    to="/receptionist" 
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <Grid size={20} />
                    <span className="font-bold">Room Status Board</span>
                </Link>

                <Link 
                    to="/guests" 
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <Users size={20} />
                    <span className="font-bold">Guest Directory</span>
                </Link>

                <Link 
                    to="/walkin" 
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <UserPlus size={20} />
                    <span className="font-bold">Walk-in Booking</span>
                </Link>

            </div>
            
        </aside>
    );
}