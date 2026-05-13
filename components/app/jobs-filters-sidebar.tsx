"use client"

import { useState } from "react"
import { Search, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const categories = [
  { id: "web-dev", label: "Web Development" },
  { id: "design", label: "Design" },
  { id: "writing", label: "Writing" },
  { id: "marketing", label: "Marketing" },
  { id: "mobile", label: "Mobile Development" },
  { id: "data", label: "Data Science" },
]

const experienceLevels = [
  { value: "entry", label: "Entry" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
]

const durations = [
  { value: "any", label: "Any Duration" },
  { value: "less-than-1-week", label: "Less than 1 week" },
  { value: "1-4-weeks", label: "1 - 4 weeks" },
  { value: "1-3-months", label: "1 - 3 months" },
  { value: "3-plus-months", label: "3+ months" },
]

interface FiltersState {
  search: string
  categories: string[]
  budgetRange: [number, number]
  projectType: "fixed" | "hourly"
  experienceLevel: string
  duration: string
}

interface JobsFiltersSidebarProps {
  className?: string
  onFiltersChange?: (filters: FiltersState) => void
}

export function JobsFiltersSidebar({ className, onFiltersChange }: JobsFiltersSidebarProps) {
  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    categories: [],
    budgetRange: [0, 100000],
    projectType: "fixed",
    experienceLevel: "intermediate",
    duration: "any",
  })

  const updateFilters = (updates: Partial<FiltersState>) => {
    const newFilters = { ...filters, ...updates }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId]
    updateFilters({ categories: newCategories })
  }

  const resetFilters = () => {
    const defaultFilters: FiltersState = {
      search: "",
      categories: [],
      budgetRange: [0, 100000],
      projectType: "fixed",
      experienceLevel: "intermediate",
      duration: "any",
    }
    setFilters(defaultFilters)
    onFiltersChange?.(defaultFilters)
  }

  const formatBudget = (value: number) => {
    if (value >= 100000) return "1,00,000+"
    return new Intl.NumberFormat("en-IN").format(value)
  }

  return (
    <aside className={cn("flex flex-col gap-6", className)}>
      {/* Search */}
      <div>
        <label className="mb-2 block text-sm font-medium">Search</label>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="mb-3 block text-sm font-medium">Category</label>
        <div className="flex flex-col gap-2.5">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2.5">
              <Checkbox
                id={category.id}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label
                htmlFor={category.id}
                className="cursor-pointer text-sm font-normal text-foreground/80"
              >
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <label className="mb-3 block text-sm font-medium">Budget Range</label>
        <Slider
          value={filters.budgetRange}
          min={0}
          max={100000}
          step={1000}
          onValueChange={(value) =>
            updateFilters({ budgetRange: value as [number, number] })
          }
          className="mb-3"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>₹{formatBudget(filters.budgetRange[0])}</span>
          <span>₹{formatBudget(filters.budgetRange[1])}</span>
        </div>
      </div>

      {/* Project Type */}
      <div>
        <label className="mb-3 block text-sm font-medium">Project Type</label>
        <div className="flex rounded-lg border border-border p-1">
          <button
            onClick={() => updateFilters({ projectType: "fixed" })}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              filters.projectType === "fixed"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Fixed Price
          </button>
          <button
            onClick={() => updateFilters({ projectType: "hourly" })}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              filters.projectType === "hourly"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Hourly
          </button>
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="mb-3 block text-sm font-medium">Experience Level</label>
        <RadioGroup
          value={filters.experienceLevel}
          onValueChange={(value) => updateFilters({ experienceLevel: value })}
        >
          {experienceLevels.map((level) => (
            <div key={level.value} className="flex items-center gap-2.5">
              <RadioGroupItem value={level.value} id={level.value} />
              <Label
                htmlFor={level.value}
                className="cursor-pointer text-sm font-normal text-foreground/80"
              >
                {level.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Duration */}
      <div>
        <label className="mb-3 block text-sm font-medium">Duration</label>
        <Select
          value={filters.duration}
          onValueChange={(value) => updateFilters({ duration: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {durations.map((duration) => (
              <SelectItem key={duration.value} value={duration.value}>
                {duration.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-2">
        <Button className="w-full">Apply Filters</Button>
        <button
          onClick={resetFilters}
          className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
          Reset Filters
        </button>
      </div>
    </aside>
  )
}
