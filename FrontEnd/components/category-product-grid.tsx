"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import { accountApi, type Account } from "@/lib/api"
import { toast } from "sonner"

// Backup mock data for fallback
const mockProducts = [
  {
    id: "1",
    title: "ChatGPT Plus Premium Account",
    description: "Tài khoản ChatGPT Plus với đầy đủ tính năng GPT-4, không giới hạn sử dụng",
    price: 450000,
    originalPrice: 600000,
    rating: 4.8,
    reviewCount: 124,
    category: "AI Account",
    image: "/placeholder-h7ony.png",
    seller: "TechStore",
    isHot: true,
  },
  {
    id: "2",
    title: "GitHub Copilot Business",
    description: "Tài khoản GitHub Copilot Business cho team phát triển, AI coding assistant",
    price: 350000,
    rating: 4.9,
    reviewCount: 89,
    category: "AI Account",
    image: "/github-copilot-interface.png",
    seller: "DevTools",
  },
  {
    id: "3",
    title: "JetBrains All Products Pack",
    description: "Bộ công cụ IDE đầy đủ từ JetBrains: IntelliJ, WebStorm, PyCharm, PhpStorm...",
    price: 1200000,
    originalPrice: 1500000,
    rating: 4.7,
    reviewCount: 156,
    category: "IDE & Tools",
    image: "/jetbrains-ide-interface.png",
    seller: "CodeMaster",
    isHot: true,
  },
  {
    id: "4",
    title: "E-commerce React Template",
    description: "Template React hoàn chỉnh cho website thương mại điện tử với admin panel",
    price: 800000,
    rating: 4.6,
    reviewCount: 203,
    category: "Source Code",
    image: "/react-ecommerce-template.png",
    seller: "WebDev Pro",
  },
  {
    id: "5",
    title: "Claude Pro Account",
    description: "Tài khoản Claude Pro với khả năng xử lý văn bản và code chuyên nghiệp",
    price: 400000,
    rating: 4.5,
    reviewCount: 67,
    category: "AI Account",
    image: "/claude-ai-interface.png",
    seller: "AI Solutions",
  },
  {
    id: "6",
    title: "Next.js SaaS Boilerplate",
    description: "Boilerplate Next.js đầy đủ tính năng cho ứng dụng SaaS: auth, payment, dashboard",
    price: 1500000,
    originalPrice: 2000000,
    rating: 4.8,
    reviewCount: 91,
    category: "Source Code",
    image: "/nextjs-saas-dashboard.png",
    seller: "SaaS Builder",
  },
  // Additional AI Account products
  {
    id: "7",
    title: "Midjourney Pro Account",
    description: "Tài khoản Midjourney Pro để tạo hình ảnh AI chất lượng cao không giới hạn",
    price: 500000,
    rating: 4.7,
    reviewCount: 145,
    category: "AI Account",
    image: "/placeholder-h7ony.png",
    seller: "AI Creative",
  },
  {
    id: "8",
    title: "Notion AI Workspace",
    description: "Workspace Notion với AI features để tối ưu hóa productivity và quản lý dự án",
    price: 300000,
    rating: 4.6,
    reviewCount: 78,
    category: "AI Account",
    image: "/placeholder-h7ony.png",
    seller: "ProductivityHub",
  },
  // Additional IDE & Tools products
  {
    id: "9",
    title: "Visual Studio Professional",
    description: "License Visual Studio Professional với đầy đủ tính năng phát triển enterprise",
    price: 2000000,
    originalPrice: 2500000,
    rating: 4.8,
    reviewCount: 234,
    category: "IDE & Tools",
    image: "/jetbrains-ide-interface.png",
    seller: "Microsoft Partner",
    isHot: true,
  },
  {
    id: "10",
    title: "Figma Professional Team",
    description: "Tài khoản Figma Professional cho team design với unlimited projects",
    price: 800000,
    rating: 4.9,
    reviewCount: 167,
    category: "IDE & Tools",
    image: "/jetbrains-ide-interface.png",
    seller: "DesignTools",
  },
  // Additional Source Code products
  {
    id: "11",
    title: "Vue.js Admin Dashboard",
    description: "Admin dashboard Vue.js với Vuetify, charts, authentication và CRUD operations",
    price: 600000,
    rating: 4.5,
    reviewCount: 89,
    category: "Source Code",
    image: "/react-ecommerce-template.png",
    seller: "VueExperts",
  },
  {
    id: "12",
    title: "Flutter Mobile App Template",
    description: "Template Flutter hoàn chỉnh cho mobile app với backend integration",
    price: 1000000,
    originalPrice: 1300000,
    rating: 4.7,
    reviewCount: 156,
    category: "Source Code",
    image: "/nextjs-saas-dashboard.png",
    seller: "MobileDev Pro",
  },
]

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-low", label: "Giá thấp đến cao" },
  { value: "price-high", label: "Giá cao đến thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
]

interface CategoryProductGridProps {
  category: string
}

export function CategoryProductGrid({ category }: CategoryProductGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Transform Account to Product format
  const transformAccountToProduct = (account: Account) => ({
    id: account._id,
    title: account.name,
    description: account.description?.[0] || "Không có mô tả",
    price: account.price,
    originalPrice: account.Discount ? Math.round(account.price / (1 - account.Discount / 100)) : undefined,
    rating: 4.5, // Default rating since not in backend
    reviewCount: Math.floor(Math.random() * 200) + 10, // Random review count
    category: account.category?.[0] || "Khác",
    image: account.thumbnail || "/placeholder.svg",
    seller: "ZuneF.Com",
    isHot: account.Discount && account.Discount > 0,
  })

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await accountApi.getAll(1, 50) // Get more products for better filtering
        
        if (response.success && response.data) {
          const transformedProducts = response.data.accounts.map(transformAccountToProduct)
          setAllProducts(transformedProducts)
        } else {
          // Fallback to mock data if API fails
          console.warn("API failed, using mock data:", response.message)
          setAllProducts(mockProducts)
          toast.error("Không thể tải dữ liệu từ server, hiển thị dữ liệu mẫu")
        }
      } catch (err: any) {
        console.error("Error fetching products:", err)
        // Fallback to mock data on error
        setAllProducts(mockProducts)
        toast.error("Lỗi kết nối, hiển thị dữ liệu mẫu")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products by category and other criteria when dependencies change
  useEffect(() => {
    if (allProducts.length > 0) {
      filterProducts(searchQuery, sortBy)
    }
  }, [category, searchQuery, sortBy, allProducts])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
  }

  const filterProducts = (query: string, sort: string) => {
    let filtered = allProducts.filter((product) => product.category === category)

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // Sort products
    switch (sort) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
        // Keep original order for "newest"
        break
    }

    setFilteredProducts(filtered)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSortBy("newest")
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(searchQuery || sortBy !== "newest") && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {searchQuery && (
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="gap-1">
            Tìm kiếm: {searchQuery}
            <X className="h-3 w-3 cursor-pointer" onClick={() => handleSearch("")} />
          </Badge>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">Hiển thị {filteredProducts.length} sản phẩm</div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Không tìm thấy sản phẩm nào phù hợp</p>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
