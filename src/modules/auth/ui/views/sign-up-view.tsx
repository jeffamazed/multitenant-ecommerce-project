"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import z from "zod";
import { toast } from "sonner";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthBackground from "@/app/assets/img/background.png";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { poppins } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

import { signUpSchema } from "../../schemas";
import { Eye, EyeOff } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

type SignUpSchemaType = z.infer<typeof signUpSchema>;

export const SignUpView = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const trpc = useTRPC();
  const { mutate: mutateSignUp, isPending: isPendingSigningUp } = useMutation(
    trpc.auth.signUp.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => router.push("/"),
    })
  );

  const form = useForm<SignUpSchemaType>({
    mode: "onChange",
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = (values: SignUpSchemaType) => {
    mutateSignUp(values);
  };

  // FOR PREVIEWING URL
  const username = form.watch("username");

  return (
    <main className="grid grid-cols-1 md:grid-cols-5">
      <div className="bg-custom-accent-secondary h-dvh w-full md:col-span-3 lg:col-span-2 overflow-y-auto">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 common-padding"
        >
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <span className={cn("text-2xl font-semibold", poppins.className)}>
                Monavo
              </span>
            </Link>

            <Button
              asChild
              variant="link"
              size="sm"
              className="text-base border-none underline"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>

          <h1 className="text-3xl lg:text-4xl font-medium mb-4">
            Join 1,000+ creators making money doing what they love on Monavo
          </h1>

          <FieldGroup className="gap-4">
            {/* USERNAME */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel className="text-base" htmlFor="sign-up-username">
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    id="sign-up-username"
                    type="text"
                    disabled={isPendingSigningUp}
                    aria-invalid={fieldState.invalid}
                    required
                  />
                  {/* TODO: USE PROPER METHOD TO SHOW SHOP URL */}
                  <FieldDescription
                    className={cn(
                      "hidden",
                      username && !fieldState.invalid && "block"
                    )}
                    aria-label={`Your store will be available at ${username} dot shop dot com.`}
                  >
                    Your store will be available at&nbsp;
                    <strong>{username}</strong>.shop.com
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* EMAIL */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="sign-up-email" className="text-base">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="sign-up-email"
                    type="email"
                    disabled={isPendingSigningUp}
                    aria-invalid={fieldState.invalid}
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* PASSWORD */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="sign-up-password" className="text-base">
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="sign-up-password"
                      type={showPassword ? "text" : "password"}
                      disabled={isPendingSigningUp}
                      aria-invalid={fieldState.invalid}
                      required
                    />
                    {/* SHOW PASSWORD BUTTON */}
                    <Button
                      variant="ghost"
                      type="button"
                      size="icon-sm"
                      className="absolute right-3 top-1/2 -translate-y-1/2 border-none rounded-full bg-transparent hover:bg-black hover:text-white"
                      onMouseDown={(e) => e.preventDefault()} // <-- keeps input focused
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                      disabled={isPendingSigningUp}
                    >
                      {showPassword ? (
                        <Eye className="size-5" />
                      ) : (
                        <EyeOff className="size-5" />
                      )}
                    </Button>
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            size="lg"
            variant="elevated"
            className="bg-black text-white hover:bg-custom-accent hover:text-black focus-visible:bg-custom-accent focus-visible:text-black mt-4"
            disabled={isPendingSigningUp}
          >
            {isPendingSigningUp ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </div>

      <div className="h-dvh w-full md:col-span-2 lg:col-span-3 hidden md:block relative">
        <Image
          src={AuthBackground}
          alt="People in cartoon style"
          fill
          priority
          placeholder="blur"
          className="object-cover"
        />
      </div>
    </main>
  );
};
