import { AuthForm } from "@/components/auth/auth-form"
import { register } from "../actions/auth"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthForm type="register" onSubmit={register} />
    </div>
  )
} 