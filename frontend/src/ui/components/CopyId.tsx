import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";

interface Props {
    label: string;
    value: string | undefined;
}

export default function CopyId({ label, value }: Props) {
    const [showId, setShowId] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (showId) {
            const t = setTimeout(() => setShowId(false), 5000);
            return () => clearTimeout(t);
        }
    }, [showId]);

    const handleCopy = async () => {
        if (!value) return;
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            onClick={() => setShowId(!showId)}
            className="flex items-center justify-between text-sm cursor-pointer border rounded-md px-3 py-2 hover:bg-muted transition"
        >
            <div className="flex items-center py-2">
                <span className="text-muted-foreground pr-2">{label}:</span>
                <span
                    className={cn(
                        "font-mono text-xs",
                        showId ? "text-primary" : "text-muted-foreground",
                    )}
                >
                    {showId ? value : "click to reveal"}
                </span>
            </div>

            {showId && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCopy();
                    }}
                >
                    {copied ? <Check className="text-green-500" /> : <Copy className="" />}
                </Button>
            )}
        </div>
    );
}
