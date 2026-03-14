import {
    type BuildingId,
    type SafeUser,
    createBuildingStaffInviteSchema,
    buildingsBase,
    buildingsRoutes,
} from "@autocoderz/shared";

import SearchUsers from "../SearchUsers";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { apiFetch, apiUrl } from "@/lib/utils";
import type z from "zod";
import { toast } from "sonner";
import { Card } from "../ui/card";

export default function InviteBuidlingStaffForm({ buildingId }: { buildingId: BuildingId }) {
    const [selectedUser, setSelectedUser] = useState<SafeUser | null>(null);

    type FormFields = z.input<typeof createBuildingStaffInviteSchema>;
    const form = useForm<FormFields>({
        resolver: zodResolver(createBuildingStaffInviteSchema),
        defaultValues: {
            buildingId,
            role: "RECEPTIONIST",
        },
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        const parsed = createBuildingStaffInviteSchema.parse(data);

        console.log(parsed);

        const response = await apiFetch(`${apiUrl}${buildingsBase}${buildingsRoutes.invite}`, {
            method: "POST",
            body: JSON.stringify(parsed),
            headers: { "Content-Type": "application/json" },
        });

        const resData = await response.json();

        if (response.ok) {
            toast.success(`Invite sent`, {
                description: JSON.stringify(resData, null, 2),
            });
        } else {
            const { title, description } = resData.error;
            toast.error(title, { description });
        }
    };

    const handleUserSelect = (user: SafeUser) => {
        setSelectedUser(user);
        form.setValue("userId", user.id, { shouldValidate: true });
    };

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <FormLabel>Invite Staff to Building</FormLabel>

                        <SearchUsers onSelect={handleUserSelect} />

                        {selectedUser && (
                            <p className="text-sm text-muted-foreground mt-2">
                                Selected: {selectedUser.email}
                            </p>
                        )}

                        <FormMessage>{form.formState.errors.userId?.message}</FormMessage>
                    </div>

                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>

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

                    <Button type="submit">Send Invite</Button>
                </form>
            </Form>
        </Card>
    );
}
