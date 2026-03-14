import { usersBase, type SafeUser } from "@autocoderz/shared";
import { useState, useEffect } from "react";
import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
    CommandEmpty,
} from "@/components/ui/command";
import { apiFetch, apiUrl } from "@/lib/utils";
import { toast } from "sonner";

export default function SearchUsers({ onSelect }: { onSelect: (user: SafeUser) => void }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SafeUser[]>([]);

    const searchUsers = async (q: string) => {
        const response = await apiFetch(`${apiUrl}${usersBase}?q=${q}`, { method: "GET" });
        const resData = await response.json();

        if (!response.ok) {
            const { title, description } = resData.error;
            toast.error(title, { description });
            return;
        }

        setResults(resData);
    };

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(() => {
            searchUsers(query);
        }, 500);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <Command shouldFilter={false}>
            <CommandInput placeholder="Search users..." value={query} onValueChange={setQuery} />

            <CommandList>
                {results && <CommandEmpty>No users found.</CommandEmpty>}
                {results.map((user) => (
                    <CommandItem key={user.id} onSelect={() => onSelect(user)}>
                        <div className="flex flex-col">
                            <span>
                                {user.firstName} {user.middleName} {user.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    </CommandItem>
                ))}
            </CommandList>
        </Command>
    );
}
