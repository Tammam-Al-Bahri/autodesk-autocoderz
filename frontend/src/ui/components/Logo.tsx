import { Link } from "react-router-dom";
import logo from "/favicon.ico"
import logoDark from "/faviconDark.ico"

export default function Logo() {
    return (
        <div className="text-lg font-bold">
            <Link to="/">
                <img 
                    src={logoDark} 
                    alt="AutoCoderz Logo" 
                    className="h-8 w-auto dark:hidden" 
                />
                <img 
                    src={logo} 
                    alt="AutoCoderz Logo" 
                    className="h-8 w-auto hidden dark:block" 
                />
            </Link>
        </div>
    
    );
}
