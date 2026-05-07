"use client"

import React from "react"

import { useState, useTransition, useRef } from "react"
import { useRouter } from "next/navigation"
import { Plus, X, Upload, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createProduct, updateProduct } from "@/lib/actions/products"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

const categories = ["Shirts", "Trousers", "Blazers", "Jackets", "T-Shirts", "Hoodies"]

interface ProductFormProps {
  product?: Product
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    originalPrice: product?.originalPrice?.toString() || "",
    category: product?.category || "",
    subcategory: product?.subcategory || "",
    stock: product?.stock?.toString() || "0",
    featured: product?.featured || false,
  })

  const [images, setImages] = useState<string[]>(product?.images || [])
  const [sizes, setSizes] = useState<string[]>(product?.sizes || ["S", "M", "L", "XL"])
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(
    product?.colors || [{ name: "", hex: "#000000" }]
  )

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file",
          description: "Please select image files only",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setImages((prev) => [...prev, result])
        toast({
          title: "Image added",
          description: `${file.name} has been uploaded`,
        })
      }
      reader.readAsDataURL(file)
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: "Please fill required fields",
        description: "Name, price, and category are required",
        variant: "destructive",
      })
      return
    }

    const filteredImages = images.filter((img) => img.trim() !== "")
    if (filteredImages.length === 0) {
      toast({
        title: "Please add at least one image",
        variant: "destructive",
      })
      return
    }

    const filteredColors = colors.filter((c) => c.name.trim() !== "")
    const filteredSizes = sizes.filter((s) => s.trim() !== "")

    startTransition(async () => {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        images: filteredImages,
        sizes: filteredSizes,
        colors: filteredColors,
        stock: parseInt(formData.stock) || 0,
        featured: formData.featured,
      }

      try {
        if (product?._id) {
          const updated = await updateProduct(product._id, productData)
          if (!updated) {
            throw new Error("Product update failed")
          }
          toast({
            title: "Product updated",
            description: `${formData.name} has been updated.`,
          })
        } else {
          const createdProduct = await createProduct(productData)
          if (!createdProduct?._id) {
            throw new Error("Product creation failed")
          }
          toast({
            title: "Product created",
            description: `${formData.name} has been added to the catalog.`,
          })
        }
        router.replace("/admin/products")
      } catch {
        toast({
          title: "Error",
          description: "Failed to save product",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Basic Information</h2>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Classic Oxford Shirt"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your product..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                placeholder="Formal, Casual, etc."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Pricing & Inventory</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price">Price (Rs.) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="1499"
              required
            />
          </div>
          <div>
            <Label htmlFor="originalPrice">Original Price (Rs.)</Label>
            <Input
              id="originalPrice"
              name="originalPrice"
              type="number"
              value={formData.originalPrice}
              onChange={handleInputChange}
              placeholder="2499"
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="50"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Product Images</h2>
          <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {images.length} {images.length === 1 ? "image" : "images"}
          </span>
        </div>

        {/* Upload Area */}
        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-lg p-8 hover:border-accent hover:bg-accent/5 transition-colors flex flex-col items-center gap-3 cursor-pointer"
          >
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium text-foreground">Click to upload images</p>
              <p className="text-sm text-muted-foreground">or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
          </button>
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden bg-muted aspect-square"
              >
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setImages(images.filter((_, i) => i !== index))
                    }
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground">No images added yet</p>
            <p className="text-xs text-muted-foreground mt-1">Add at least one image to continue</p>
          </div>
        )}
      </div>

      {/* Sizes */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Available Sizes</h2>
          <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {sizes.length} {sizes.length === 1 ? "size" : "sizes"}
          </span>
        </div>
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {sizes.map((size, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2"
              >
                <Input
                  value={size}
                  onChange={(e) => {
                    const newSizes = [...sizes]
                    newSizes[index] = e.target.value.toUpperCase()
                    setSizes(newSizes)
                  }}
                  placeholder="Size"
                  className="w-16 h-8 text-center bg-background"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSizes(sizes.filter((_, i) => i !== index))}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSizes([...sizes, ""])}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Size
          </Button>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Colors</h2>
        <div className="space-y-3">
          {colors.map((color, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={color.name}
                onChange={(e) => {
                  const newColors = [...colors]
                  newColors[index].name = e.target.value
                  setColors(newColors)
                }}
                placeholder="Color name"
                className="flex-1"
              />
              <Input
                type="color"
                value={color.hex}
                onChange={(e) => {
                  const newColors = [...colors]
                  newColors[index].hex = e.target.value
                  setColors(newColors)
                }}
                className="w-16 p-1 h-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setColors(colors.filter((_, i) => i !== index))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => setColors([...colors, { name: "", hex: "#000000" }])}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Color
          </Button>
        </div>
      </div>

      {/* Featured */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Featured Product</h2>
            <p className="text-sm text-muted-foreground">
              Show this product on the homepage
            </p>
          </div>
          <Switch
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
          disabled={isPending}
        >
          {isPending ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  )
}
