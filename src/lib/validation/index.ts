import * as z from "zod";

export const SignupValidation = z.object({
    name: z.string().min(2, {message: 'A real one, please'}).max(20),
    username: z.string().min(2, {message: 'Too short for a cool nickname' }).max(20),
    email: z.string().email(),
    password: z.string().min(8, {message: 'At least 8 characters' }),
  });