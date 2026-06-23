import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/pages/auth-layout'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'ava@apiforge.dev', password: 'password123' },
  })

  return (
    <AuthLayout
      title="Sign in to APIForge"
      description="Open your workspaces, send requests, and inspect responses in one focused interface."
      footer={<>
        No account yet? <button type="button" className="text-primary hover:underline" onClick={() => navigate('/register')}>Create one</button>
      </>}
    >
      <form className="space-y-4" onSubmit={form.handleSubmit(() => navigate('/'))}>
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input id="login-email" type="email" {...form.register('email')} aria-invalid={form.formState.errors.email ? 'true' : 'false'} />
          {form.formState.errors.email ? <p className="text-sm text-rose-300">{form.formState.errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <Input id="login-password" type="password" {...form.register('password')} aria-invalid={form.formState.errors.password ? 'true' : 'false'} />
          {form.formState.errors.password ? <p className="text-sm text-rose-300">{form.formState.errors.password.message}</p> : null}
        </div>
        <Button className="w-full" type="submit">Login</Button>
      </form>
    </AuthLayout>
  )
}