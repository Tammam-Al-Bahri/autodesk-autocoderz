import LoadingPage from "@/components/LoadingPage";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CopyId from "@/components/CopyId";

export default function Profile() {
    const { user, loading } = useAuth();

    if (loading) return <LoadingPage />;

    const fullName = [user?.firstName, user?.middleName, user?.lastName].filter(Boolean).join(" ");

    const initials = (user?.firstName?.[0] || "") + (user?.lastName?.[0] || "");

    return (
        <div className="flex justify-center items-start mt-10 px-4">
            <Card className="w-full max-w-md shadow-md">
                <CardHeader className="flex flex-col items-center text-center gap-2">
                    <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold">
                        {initials || "?"}
                    </div>

                    <CardTitle>{fullName || "User"}</CardTitle>
                    <CardDescription>{user?.email}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <CopyId label="User ID" value={user?.id} />

                    <div className="text-sm space-y-1">
                        <div>
                            <span className="text-muted-foreground">First Name:</span>{" "}
                            {user?.firstName}
                        </div>
                        {user?.middleName && (
                            <div>
                                <span className="text-muted-foreground">Middle Name:</span>{" "}
                                {user.middleName}
                            </div>
                        )}
                        <div>
                            <span className="text-muted-foreground">Last Name:</span>{" "}
                            {user?.lastName}
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <LogoutButton />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
