"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const formSchema = z
  .object({
    currentPassword: z.string().min(6, "Current Password is required"),
    newPassword: z.string().min(6, "New Password must be at least 6 characters"),
    confirmNewPassword: z.string().min(6, "Confirm New Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

const ChangePasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log("Form Data:", data))} className="space-y-4">
      <div>
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input id="currentPassword" type="password" {...register("currentPassword")} placeholder="Enter current password" />
        {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
      </div>

      <div>
        <Label htmlFor="newPassword">New Password</Label>
        <Input id="newPassword" type="password" {...register("newPassword")} placeholder="Enter new password" />
        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
      </div>

      <div>
        <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
        <Input id="confirmNewPassword" type="password" {...register("confirmNewPassword")} placeholder="Confirm new password" />
        {errors.confirmNewPassword && <p className="text-red-500 text-sm">{errors.confirmNewPassword.message}</p>}
      </div>

      <Button type="submit" className="w-full">
        Change Password
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
