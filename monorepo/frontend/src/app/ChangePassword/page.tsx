import ChangePasswordForm from "@/components/forms/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Change Password
        </h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}