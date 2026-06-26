import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const optionalDeathYear = z.union([
  z.coerce.number().int().min(1800, "Death year must be 1800 or later").max(2100, "Death year must be 2100 or earlier"),
  z.literal(""),
  z.null(),
  z.undefined(),
]);

export const memberFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200, "Name is too long"),
  birthYear: z.coerce
    .number({ invalid_type_error: "Birth year is required" })
    .int()
    .min(1800, "Birth year must be 1800 or later")
    .max(2100, "Birth year must be 2100 or earlier"),
  deathYear: optionalDeathYear,
  title: z.string().trim().min(1, "Title is required").max(100, "Title is too long"),
  bio: z.string().trim().min(1, "Biography is required").max(5000, "Biography is too long"),
  photo: z.string().max(2048, "Photo URL is too long").optional().default(""),
  generation: z.coerce
    .number({ invalid_type_error: "Generation is required" })
    .int()
    .min(1, "Generation is required"),
  parentIds: z.array(z.string()).default([]),
  spouseId: z.string().nullable().optional(),
  childrenIds: z.array(z.string()).default([]),
  fatherName: z.string().max(200, "Father's name is too long").optional().default(""),
  address: z.string().trim().min(1, "Address is required").max(500, "Address is too long"),
  mobile: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .max(20, "Mobile must be at most 20 characters"),
  email: z
    .string()
    .trim()
    .refine((value) => value === "" || z.string().email().safeParse(value).success, {
      message: "Please enter a valid email address",
    })
    .optional()
    .default(""),
  information: z.string().max(2000, "Information is too long").optional().default(""),
});
