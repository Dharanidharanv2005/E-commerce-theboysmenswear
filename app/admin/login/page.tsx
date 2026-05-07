"use client"

import React from "react"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { loginUser, registerAdmin } from "@/lib/actions/auth"
import { useToast } from "@/hooks/use-toast"

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await loginUser(formData)

      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "You have been signed in as admin.",
        })
        router.push("/admin")
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to sign in",
          variant: "destructive",
        })
      }
    })
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await registerAdmin(formData)

      if (result.success) {
        toast({
          title: "Admin account created!",
          description: "You can now access the admin dashboard.",
        })
        router.push("/admin")
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create admin account",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-8">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border border-border shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <Link href="/" className="inline-block">
              <h1 className="font-serif text-2xl font-bold text-primary">
                THE BOYS
              </h1>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Admin Portal
              </p>
            </Link>
          </div>

          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email Address</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="admin@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isPending}
                >
                  {isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    name="name"
                    type="text"
                    placeholder="Admin Name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="register-email">Email Address</Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    minLength={6}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="adminCode">Admin Code</Label>
                  <Input
                    id="adminCode"
                    name="adminCode"
                    type="password"
                    placeholder="Enter admin code"
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Contact system administrator for the admin code
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isPending}
                >
                  {isPending ? "Creating account..." : "Create Admin Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/" className="text-accent hover:underline">
              Return to Store
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
