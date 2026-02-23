import { Loader } from "lucide-react";

export default function LoadingPage() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center h-screen">
            <Loader className="animate-spin" />
        </div>
    );
}
