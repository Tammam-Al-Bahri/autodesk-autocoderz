import { PasswordResetForm } from "@/components/passwordreset-form";

export default function PasswordResetPage() {
    return (
        <div className="flex flex-1 items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <PasswordResetForm />
            </div>
        </div>
    );
}