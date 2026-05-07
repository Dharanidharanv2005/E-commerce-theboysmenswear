"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateOrderStatus } from "@/lib/actions/orders"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/lib/types"

interface OrderStatusSelectProps {
  orderId: string
  currentStatus: Order["status"]
}

const statuses: { value: Order["status"]; label: string; color: string }[] = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "processing", label: "Processing", color: "bg-blue-100 text-blue-800" },
  { value: "shipped", label: "Shipped", color: "bg-indigo-100 text-indigo-800" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
]

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (newStatus: Order["status"]) => {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus)

      if (result.success) {
        toast({
          title: "Status updated",
          description: `Order status changed to ${newStatus}`,
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: "Failed to update order status",
          variant: "destructive",
        })
      }
    })
  }

  const currentStatusInfo = statuses.find((s) => s.value === currentStatus)

  return (
    <Select
      value={currentStatus}
      onValueChange={(value) => handleStatusChange(value as Order["status"])}
      disabled={isPending}
    >
      <SelectTrigger className={`w-[130px] h-8 text-xs font-medium ${currentStatusInfo?.color}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
              {status.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
