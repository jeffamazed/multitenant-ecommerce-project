"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import z from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Controller, useForm } from "react-hook-form";
import { signInSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthBackground from "@/app/assets/img/background.png";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { poppins } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

type SignInSchemaType = z.infer<typeof signInSchema>;

export const SignInView = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate: mutateSignIn } = useMutation(
    trpc.auth.signIn.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
        setIsPending(false);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        router.push("/");
      },
    })
  );

  // FOR FOCUSING FIRST INPUT
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => firstInputRef.current?.focus(), []);

  const form = useForm<SignInSchemaType>({
    mode: "onChange",
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: SignInSchemaType) => {
    setIsPending(true);
    mutateSignIn(values);
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-5">
      <div className="bg-custom-accent-secondary h-dvh w-full md:col-span-3 lg:col-span-2 overflow-y-auto">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 common-padding"
        >
          <div className="flex items-center justify-between mb-8 flex-wrap">
            <Link href="/">
              <span className={cn("text-2xl font-semibold", poppins.className)}>
                Monavo
              </span>
            </Link>

            <Button asChild variant="customLink" size="sm">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>

          <h1 className="mb-4">Welcome back to Monavo</h1>

          <FieldSet>
            <FieldLegend className="sr-only">
              Sign In Credentials Information
            </FieldLegend>
            <FieldGroup className="gap-4">
              {/* EMAIL */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="sign-in-email" className="text-base">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="sign-in-email"
                      type="email"
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                      required
                      ref={firstInputRef}
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
                    <FieldLabel
                      htmlFor="sign-in-password"
                      className="text-base"
                    >
                      Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="sign-in-password"
                        type={showPassword ? "text" : "password"}
                        disabled={isPending}
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
                        disabled={isPending}
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
          </FieldSet>

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            size="lg"
            variant="elevated"
            className="bg-black text-white hover:bg-custom-accent hover:text-black focus-visible:bg-custom-accent focus-visible:text-black mt-4"
            disabled={isPending}
          >
            {isPending ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </div>

      <div className="h-dvh w-full md:col-span-2 lg:col-span-3 hidden md:block relative">
        <Image
          src={AuthBackground}
          alt="People in cartoon style"
          fill
          sizes="80vw"
          priority
          placeholder="blur"
          className="object-cover"
        />
      </div>
    </main>
  );
};
