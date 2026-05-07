"use client"

import React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Truck, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createOrder } from "@/lib/actions/orders"
import { useToast } from "@/hooks/use-toast"
import type { SessionPayload } from "@/lib/auth"

interface CheckoutFormProps {
  user: SessionPayload
}

export function CheckoutForm({ user }: CheckoutFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const [formData, setFormData] = useState({
    name: user.name,
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.address || !formData.city || !formData.state || !formData.pincode || !formData.phone) {
      toast({
        title: "Please fill all fields",
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      const result = await createOrder({
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        phone: formData.phone,
      })

      if (result.success) {
        toast({
          title: "Order placed successfully!",
          description: `Order ID: ${result.orderId}`,
        })
        router.push(`/dashboard/orders/${result.orderId}`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to place order",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Address */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Truck className="h-5 w-5 text-accent" />
          Shipping Address
        </h2>

        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Street address, apartment, building"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Mumbai"
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Maharashtra"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pincode">PIN Code</Label>
              <Input
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="400001"
                pattern="[0-9]{6}"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Info */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Banknote className="h-5 w-5 text-accent" />
          Payment Method
        </h2>
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="font-medium text-foreground">Cash on Delivery</p>
          <p className="text-sm text-muted-foreground mt-1">
            Pay the full amount when you receive your order. No prepayment required.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
            Placing Order...
          </>
        ) : (
          "Place Order"
        )}
      </Button>
    </form>
  )
}
