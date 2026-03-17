import {
    type BuildingId,
    createBuildingStaffInviteSchema,
    buildingsBase,
    buildingsRoutes,
    type SafeUserNoEmail,
} from "@autocoderz/shared";

import SearchUsers from "../SearchUsers";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { apiFetch, apiUrl, cn } from "@/lib/utils";
import type z from "zod";
import { toast } from "sonner";
import { Card } from "../ui/card";

export default function InviteBuidlingStaffForm({ buildingId }: { buildingId: BuildingId }) {
    const [selectedUser, setSelectedUser] = useState<SafeUserNoEmail | null>(null);

    type FormFields = z.input<typeof createBuildingStaffInviteSchema>;

    const form = useForm<FormFields>({
        resolver: zodResolver(createBuildingStaffInviteSchema),
        defaultValues: {
            buildingId,
            role: "RECEPTIONIST",
        },
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const parsed = createBuildingStaffInviteSchema.parse(data);

            const res = await apiFetch(`${apiUrl}${buildingsBase}${buildingsRoutes.invite}`, {
                method: "POST",
                body: JSON.stringify(parsed),
                headers: { "Content-Type": "application/json" },
            });

            const json = await res.json();

            if (res.ok) {
                toast.success("Invite sent");
                form.reset({ buildingId, role: "RECEPTIONIST" });
                setSelectedUser(null);
            } else {
                toast.error(json.error?.title || "Error sending invite");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleUserSelect = (user: SafeUserNoEmail) => {
        setSelectedUser(user);
        form.setValue("userId", user.id);
    };

    return (
        <Card className={cn("p-4")}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <FormLabel className="text-sm font-semibold">Invite staff</FormLabel>

                        <SearchUsers onSelect={handleUserSelect} />

                        {selectedUser && (
                            <div className="mt-2 text-sm">
                                Selected:{" "}
                                {`${selectedUser.firstName} ${selectedUser.middleName} ${selectedUser.lastName}`}
                            </div>
                        )}

                        <FormMessage>{form.formState.errors.userId?.message}</FormMessage>
                    </div>

                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Role</FormLabel>

                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        Send invite
                    </Button>
                </form>
            </Form>
        </Card>
    );
}
