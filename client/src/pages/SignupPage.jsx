import { SignUpForm } from "@/components/signup-form"
export default function SignUpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-lg md:max-w-5xl">
        <SignUpForm />
      </div>
    </div>
  )
}
