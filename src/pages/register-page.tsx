import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/pages/auth-layout'

const registerSchema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm your password'),
}).refine((values) => values.password === values.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: 'Ava Stone',
      email: 'ava@apiforge.dev',
      password: 'password123',
      confirmPassword: 'password123',
    },
  })

  return (
    <AuthLayout
      title="Create your APIForge account"
      description="Use a clean workspace to organize collections, environments, and request history."
      footer={<>
        Already have an account? <button type="button" className="text-primary hover:underline" onClick={() => navigate('/login')}>Sign in</button>
      </>}
    >
      <form className="space-y-4" onSubmit={form.handleSubmit(() => navigate('/'))}>
        <div className="space-y-2">
          <Label htmlFor="register-name">Name</Label>
          <Input id="register-name" {...form.register('name')} />
          {form.formState.errors.name ? <p className="text-sm text-rose-300">{form.formState.errors.name.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input id="register-email" type="email" {...form.register('email')} />
          {form.formState.errors.email ? <p className="text-sm text-rose-300">{form.formState.errors.email.message}</p> : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input id="register-password" type="password" {...form.register('password')} />
            {form.formState.errors.password ? <p className="text-sm text-rose-300">{form.formState.errors.password.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-confirm-password">Confirm password</Label>
            <Input id="register-confirm-password" type="password" {...form.register('confirmPassword')} />
            {form.formState.errors.confirmPassword ? <p className="text-sm text-rose-300">{form.formState.errors.confirmPassword.message}</p> : null}
          </div>
        </div>
        <Button className="w-full" type="submit">Create account</Button>
      </form>
    </AuthLayout>
  )
}