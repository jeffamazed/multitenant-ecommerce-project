import z from "zod";

export const signUpSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
      {
        error:
          "Password must contain uppercase, lowercase, number, and special character",
      }
    ),
  username: z
    .string()
    .min(3, { error: "Username must be at least 3 characters" })
    .max(63, { error: "Username must not exceed 63 characters" })
    .trim()
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, {
      error:
        "Username can only contain lowercase letters, numbers and hyphens. It must start and end with a letter or number",
    })
    .refine((val) => !val.includes("--"), {
      error: "Username cannot contain consecutive hyphens",
    })
    .transform((val) => val.toLowerCase()),
});

export const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
});
