"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Filter, ChevronDown, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface ProductFiltersProps {
  categories: string[]
  currentCategory?: string
  currentSort?: string
  currentSearch?: string
  mobile?: boolean
}

const sortOptions = [
  { value: "new", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
]

const priceRanges = [
  { value: "0-999", label: "Under Rs. 1,000" },
  { value: "1000-2499", label: "Rs. 1,000 - Rs. 2,499" },
  { value: "2500-4999", label: "Rs. 2,500 - Rs. 4,999" },
  { value: "5000-100000", label: "Rs. 5,000+" },
]

function FiltersContent({
  categories,
  currentCategory,
  currentSort,
  currentSearch,
  onFilterChange,
}: {
  categories: string[]
  currentCategory?: string
  currentSort?: string
  currentSearch?: string
  onFilterChange: (key: string, value: string | null) => void
}) {
  const [searchInput, setSearchInput] = useState(currentSearch || "")

  const handleClearSearch = () => {
    setSearchInput("")
    onFilterChange("search", null)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      onFilterChange("search", searchInput)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-4 pr-10"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Categories */}
      <div>
        <h3 className="font-medium text-foreground mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => onFilterChange("category", null)}
            className={cn(
              "block w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
              !currentCategory
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onFilterChange("category", category)}
              className={cn(
                "block w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                currentCategory === category
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium text-foreground mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => {
                const [min, max] = range.value.split("-")
                onFilterChange("minPrice", min)
                onFilterChange("maxPrice", max)
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <Label htmlFor="sort" className="font-medium text-foreground mb-3 block">
          Sort By
        </Label>
        <Select
          value={currentSort || "new"}
          onValueChange={(value) => onFilterChange("sort", value)}
        >
          <SelectTrigger id="sort">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => {
          onFilterChange("category", null)
          onFilterChange("minPrice", null)
          onFilterChange("maxPrice", null)
          onFilterChange("sort", null)
        }}
      >
        <X className="h-4 w-4 mr-2" />
        Clear All Filters
      </Button>
    </div>
  )
}

export function ProductFilters({
  categories,
  currentCategory,
  currentSort,
  currentSearch,
  mobile,
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === null) {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    router.push(`/products?${params.toString()}`)
  }

  if (mobile) {
    return (
      <div className="flex items-center gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FiltersContent
                categories={categories}
                currentCategory={currentCategory}
                currentSort={currentSort}
                currentSearch={currentSearch}
                onFilterChange={(key, value) => {
                  handleFilterChange(key, value)
                  setOpen(false)
                }}
              />
            </div>
          </SheetContent>
        </Sheet>

        <Select
          value={currentSort || "new"}
          onValueChange={(value) => handleFilterChange("sort", value)}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="sticky top-24 space-y-6">
      <h2 className="font-semibold text-lg text-foreground">Filters</h2>
      <FiltersContent
        categories={categories}
        currentCategory={currentCategory}
        currentSort={currentSort}
        currentSearch={currentSearch}
        onFilterChange={handleFilterChange}
      />
    </div>
  )
}
