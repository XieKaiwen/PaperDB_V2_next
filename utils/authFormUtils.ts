import z from 'zod';

export const authFormSchema = (type: string) =>
  z
    .object({
      email: z.string().email({ message: 'Invalid email address' }),
      password:
        type === 'login'
          ? z.string().min(1, { message: 'Password is required' })
          : z.string().min(8, {
              message: 'Password must be at least 8 characters long',
            }),
      confirmPassword: type === 'login' ? z.string().optional() : z.string(),
      phoneNumber:
        type === 'login'
          ? z.string().optional()
          : z.string().regex(/^\+?[1-9]\d{0,2}(?:\s?\d{1,4}){1,5}$/, {
              message: 'Invalid phone number',
            }),
      username:
        type === 'login'
          ? z.string().optional()
          : z
              .string()
              .min(3, {
                message: 'Username must be at least 3 characters long',
              })
              .max(50, {
                message: 'Username must be less than 50 characters long',
              }),
      educationLevel:
        type === 'login'
          ? z.string().optional()
          : z.string().min(2, { message: 'Please select a valid level of education' }),
    })
    .refine(
      (data) => {
        if (type !== 'login') {
          return data.password === data.confirmPassword;
        }
        return true; // No confirmPassword check for login type
      },
      {
        message: 'Passwords do not match',
        path: ['confirmPassword'], // Path to indicate where the error occurs
      },
    );
