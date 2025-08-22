"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./product-card"
import { accountApi } from "@/lib/api"
import { toast } from "sonner"

// Backup mock data for fallback
const mockRelatedProducts = [
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
]

interface RelatedProductsProps {
  currentProductId: string
  category: string
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true)
        
        const response = await accountApi.getAll()
        
        if (response.success && response.data) {
          // Transform and filter API data
          const transformedProducts = response.data
            .filter((item: any) => item.id !== currentProductId && item.category === category)
            .slice(0, 4)
            .map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              price: item.price,
              originalPrice: item.originalPrice,
              rating: item.rating || 4.5,
              reviewCount: item.reviewCount || 0,
              category: item.category,
              image: item.imagepreview || "/placeholder-h7ony.png",
              seller: item.seller || "ZuneF Store",
              isHot: item.isHot || false,
            }))
          
          // If not enough related products from same category, add some from other categories
          if (transformedProducts.length < 4) {
            const otherProducts = response.data
              .filter((item: any) => item.id !== currentProductId && item.category !== category)
              .slice(0, 4 - transformedProducts.length)
              .map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                price: item.price,
                originalPrice: item.originalPrice,
                rating: item.rating || 4.5,
                reviewCount: item.reviewCount || 0,
                category: item.category,
                image: item.imagepreview || "/placeholder-h7ony.png",
                seller: item.seller || "ZuneF Store",
                isHot: item.isHot || false,
              }))
            transformedProducts.push(...otherProducts)
          }
          
          setRelatedProducts(transformedProducts)
        } else {
          // Fallback to mock data
          const filteredMockProducts = mockRelatedProducts.filter((product) => product.id !== currentProductId).slice(0, 4)
          setRelatedProducts(filteredMockProducts)
        }
      } catch (err: any) {
        console.error("Error fetching related products:", err)
        // Fallback to mock data on error
        const filteredMockProducts = mockRelatedProducts.filter((product) => product.id !== currentProductId).slice(0, 4)
        setRelatedProducts(filteredMockProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [currentProductId, category])

  if (loading) {
    return (
      <section className="py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Sản phẩm liên quan</h2>
          <p className="text-muted-foreground">Những sản phẩm tương tự bạn có thể quan tâm</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Sản phẩm liên quan</h2>
        <p className="text-muted-foreground">Những sản phẩm tương tự bạn có thể quan tâm</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  )
}
