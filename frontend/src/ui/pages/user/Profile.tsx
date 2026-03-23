import LoadingPage from "@/components/LoadingPage";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import CopyId from "@/components/CopyId";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { useManagerView } from "@/context/ManagerViewContext";
import { Link } from "react-router-dom";

export default function Profile() {
    const { user, loading } = useAuth();

    if (loading) return <LoadingPage />;

    const fullName = [user?.firstName, user?.middleName, user?.lastName].filter(Boolean).join(" ");

    const initials = (user?.firstName?.[0] || "") + (user?.lastName?.[0] || "");

    const { enabled: managerViewChecked, setEnabled: setManagerViewChecked } = useManagerView();

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

                    <FieldGroup className="max-w-sm">
                        <Field orientation="horizontal">
                            <Checkbox
                                id="manager-view"
                                name="manager-view"
                                checked={managerViewChecked}
                                onCheckedChange={(value) => setManagerViewChecked(value === true)}
                            />
                            <Label htmlFor="manager-view" className="text-accent-foreground">
                                Enable Manager View
                            </Label>
                        </Field>
                    </FieldGroup>

                    <CardFooter className="flex flex-col justify-center gap-2">
                        <LogoutButton />
                        <Link
                            to="/password-reset"
                            className="flex items-center justify-center text-xs font-semibold text-accent-foreground hover:underline"
                        >
                            Reset Password
                        </Link>
                    </CardFooter>
                </CardContent>
            </Card>
        </div>
    );
}
