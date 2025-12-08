"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    email: z.string().email("Invalid email"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    phone: z.string().optional(),
    net_id: z.string().optional(),
    security_question1: z.string().optional(),
    security_answer1: z.string().optional(),
    security_question2: z.string().optional(),
    security_answer2: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const CreateAccountForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });
  const router = useRouter();

  const onSubmit = async (data: any) => {
    // Remove confirmPassword from payload
    const { confirmPassword, ...payload } = data;
    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Account creation failed");
      }
      router.push("/AccountConfirmation");
    } catch (err) {
      console.error("Error creating account:", err);
      alert("Account creation failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} placeholder="Enter your name" />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          {...register("username")}
          placeholder="Enter a username"
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" {...register("email")} placeholder="Enter your email" />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="first_name">First Name</Label>
        <Input
          id="first_name"
          {...register("first_name")}
          placeholder="Enter your first name"
        />
        {errors.first_name && (
          <p className="text-red-500 text-sm">{errors.first_name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          id="last_name"
          {...register("last_name")}
          placeholder="Enter your last name"
        />
        {errors.last_name && (
          <p className="text-red-500 text-sm">{errors.last_name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Additional fields */}
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" {...register("phone")} placeholder="Enter your phone" />
      </div>

      <div>
        <Label htmlFor="net_id">Net ID</Label>
        <Input id="net_id" {...register("net_id")} placeholder="Enter your Net ID" />
      </div>

      <div>
        <Label htmlFor="security_question1">Security Question 1</Label>
        <Input
          id="security_question1"
          {...register("security_question1")}
          placeholder="Enter security question 1"
        />
      </div>

      <div>
        <Label htmlFor="security_answer1">Security Answer 1</Label>
        <Input
          id="security_answer1"
          {...register("security_answer1")}
          placeholder="Enter security answer 1"
        />
      </div>

      <div>
        <Label htmlFor="security_question2">Security Question 2</Label>
        <Input
          id="security_question2"
          {...register("security_question2")}
          placeholder="Enter security question 2"
        />
      </div>

      <div>
        <Label htmlFor="security_answer2">Security Answer 2</Label>
        <Input
          id="security_answer2"
          {...register("security_answer2")}
          placeholder="Enter security answer 2"
        />
      </div>

      <Button
        type="submit"
        className={cn(
          "w-full text-white font-semibold py-2 px-4 rounded-lg transition",
          "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 hover:from-blue-500 hover:via-blue-600 hover:to-blue-800"
        )}
      >
        Create Account
      </Button>
    </form>
  );
};

export default CreateAccountForm;