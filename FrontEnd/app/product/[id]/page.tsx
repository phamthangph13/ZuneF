"use client"

import { useState, useEffect } from "react"
import { ProductDetail } from "@/components/product-detail"
import { RelatedProducts } from "@/components/related-products"
import { notFound } from "next/navigation"
import { accountApi } from "@/lib/api"
import { toast } from "sonner"

// Backup mock data for fallback
const mockProducts = {
  "1": {
    id: "1",
    title: "ChatGPT Plus Premium Account",
    description:
      "Tài khoản ChatGPT Plus với đầy đủ tính năng GPT-4, không giới hạn sử dụng. Bao gồm truy cập vào các tính năng mới nhất như Code Interpreter, Plugins và Advanced Data Analysis.",
    fullDescription: `
      <h3>Tính năng chính:</h3>
      <ul>
        <li>Truy cập GPT-4 không giới hạn</li>
        <li>Tốc độ phản hồi nhanh hơn</li>
        <li>Ưu tiên truy cập khi hệ thống quá tải</li>
        <li>Truy cập sớm các tính năng mới</li>
        <li>Code Interpreter tích hợp</li>
        <li>Hỗ trợ Plugins đa dạng</li>
      </ul>
      
      <h3>Thông tin tài khoản:</h3>
      <ul>
        <li>Thời hạn: 1 tháng</li>
        <li>Bảo hành: 30 ngày</li>
        <li>Hỗ trợ 24/7</li>
        <li>Đổi tài khoản miễn phí nếu có lỗi</li>
      </ul>
    `,
    price: 450000,
    originalPrice: 600000,
    rating: 4.8,
    reviewCount: 124,
    category: "AI Account",
    images: ["/placeholder-h7ony.png", "/chatgpt-interface-1.png", "/chatgpt-interface-2.png", "/chatgpt-features.png"],
    seller: {
      name: "TechStore",
      rating: 4.9,
      totalSales: 1250,
      joinDate: "2023-01-15",
      avatar: "/seller-avatar-1.png",
    },
    specifications: {
      "Loại tài khoản": "ChatGPT Plus",
      "Thời hạn": "1 tháng",
      "Bảo hành": "30 ngày",
      "Hỗ trợ": "24/7",
      "Tính năng": "GPT-4, Code Interpreter, Plugins",
    },
    tags: ["AI", "ChatGPT", "GPT-4", "Premium", "Hot"],
    inStock: true,
    stockCount: 15,
    isHot: true,
  },
  "2": {
    id: "2",
    title: "GitHub Copilot Business",
    description: "Tài khoản GitHub Copilot Business cho team phát triển, AI coding assistant",
    fullDescription: `
      <h3>GitHub Copilot Business Features:</h3>
      <ul>
        <li>AI-powered code suggestions</li>
        <li>Support for multiple programming languages</li>
        <li>Team management features</li>
        <li>Enterprise-grade security</li>
        <li>Priority support</li>
      </ul>
    `,
    price: 350000,
    rating: 4.9,
    reviewCount: 89,
    category: "AI Account",
    images: ["/github-copilot-interface.png", "/copilot-features-1.png", "/copilot-features-2.png"],
    seller: {
      name: "DevTools",
      rating: 4.8,
      totalSales: 890,
      joinDate: "2023-03-20",
      avatar: "/seller-avatar-2.png",
    },
    specifications: {
      "Loại tài khoản": "GitHub Copilot Business",
      "Thời hạn": "1 tháng",
      "Bảo hành": "15 ngày",
      "Hỗ trợ": "Business hours",
      "Tính năng": "AI Code Assistant, Team Management",
    },
    tags: ["GitHub", "Copilot", "AI", "Coding", "Business"],
    inStock: true,
    stockCount: 8,
    isHot: false,
  },
  "3": {
    id: "3",
    title: "JetBrains All Products Pack",
    description:
      "Gói tất cả sản phẩm JetBrains IDE bao gồm IntelliJ IDEA, WebStorm, PyCharm, PhpStorm và nhiều hơn nữa",
    fullDescription: `
      <h3>Bao gồm các IDE:</h3>
      <ul>
        <li>IntelliJ IDEA Ultimate</li>
        <li>WebStorm</li>
        <li>PyCharm Professional</li>
        <li>PhpStorm</li>
        <li>RubyMine</li>
        <li>CLion</li>
        <li>DataGrip</li>
        <li>Rider</li>
        <li>GoLand</li>
        <li>AppCode</li>
      </ul>
    `,
    price: 1200000,
    originalPrice: 1500000,
    rating: 4.7,
    reviewCount: 156,
    category: "IDE & Tools",
    images: ["/jetbrains-ide-interface.png", "/placeholder-h7ony.png"],
    seller: {
      name: "DevTools",
      rating: 4.8,
      totalSales: 890,
      joinDate: "2023-03-20",
      avatar: "/seller-avatar-2.png",
    },
    specifications: {
      "Loại license": "All Products Pack",
      "Thời hạn": "1 năm",
      "Bảo hành": "60 ngày",
      "Hỗ trợ": "24/7",
      "Số IDE": "10+ IDE",
    },
    tags: ["JetBrains", "IDE", "Development", "All Products"],
    inStock: true,
    stockCount: 5,
    isHot: true,
  },
  "4": {
    id: "4",
    title: "React E-commerce Template",
    description: "Template React hoàn chỉnh cho website thương mại điện tử với admin dashboard",
    fullDescription: `
      <h3>Tính năng chính:</h3>
      <ul>
        <li>Frontend React với TypeScript</li>
        <li>Admin Dashboard hoàn chỉnh</li>
        <li>Tích hợp thanh toán Stripe</li>
        <li>Quản lý sản phẩm, đơn hàng</li>
        <li>Authentication & Authorization</li>
        <li>Responsive design</li>
        <li>SEO optimized</li>
      </ul>
    `,
    price: 800000,
    rating: 4.6,
    reviewCount: 78,
    category: "Source Code",
    images: ["/react-ecommerce-template.png", "/placeholder-h7ony.png"],
    seller: {
      name: "CodeMaster",
      rating: 4.7,
      totalSales: 456,
      joinDate: "2023-05-10",
      avatar: "/seller-avatar-1.png",
    },
    specifications: {
      Framework: "React + TypeScript",
      Backend: "Node.js + Express",
      Database: "MongoDB",
      Payment: "Stripe Integration",
      Documentation: "Đầy đủ",
    },
    tags: ["React", "E-commerce", "TypeScript", "Full-stack"],
    inStock: true,
    stockCount: 12,
    isHot: false,
  },
  "5": {
    id: "5",
    title: "Claude AI Pro Account",
    description: "Tài khoản Claude AI Pro với khả năng xử lý văn bản dài và phân tích tài liệu chuyên sâu",
    fullDescription: `
      <h3>Tính năng Claude AI Pro:</h3>
      <ul>
        <li>Xử lý văn bản lên đến 100K tokens</li>
        <li>Phân tích tài liệu PDF, DOC</li>
        <li>Tốc độ phản hồi nhanh</li>
        <li>Ưu tiên truy cập</li>
        <li>Hỗ trợ đa ngôn ngữ</li>
        <li>API access</li>
      </ul>
    `,
    price: 380000,
    originalPrice: 500000,
    rating: 4.9,
    reviewCount: 92,
    category: "AI Account",
    images: ["/claude-ai-interface.png", "/placeholder-h7ony.png"],
    seller: {
      name: "AIHub",
      rating: 4.9,
      totalSales: 678,
      joinDate: "2023-02-28",
      avatar: "/seller-avatar-2.png",
    },
    specifications: {
      "Loại tài khoản": "Claude Pro",
      "Thời hạn": "1 tháng",
      "Bảo hành": "30 ngày",
      "Token limit": "100K tokens",
      "API access": "Có",
    },
    tags: ["Claude", "AI", "Pro", "Document Analysis"],
    inStock: true,
    stockCount: 20,
    isHot: true,
  },
  "6": {
    id: "6",
    title: "Next.js SaaS Dashboard Template",
    description: "Template Next.js hoàn chỉnh cho ứng dụng SaaS với dashboard, authentication và billing",
    fullDescription: `
      <h3>Tính năng template:</h3>
      <ul>
        <li>Next.js 14 với App Router</li>
        <li>Authentication với NextAuth.js</li>
        <li>Dashboard analytics</li>
        <li>Subscription & Billing</li>
        <li>Multi-tenant architecture</li>
        <li>Dark/Light mode</li>
        <li>Responsive design</li>
        <li>TypeScript support</li>
      </ul>
      
      <h3>Tech Stack:</h3>
      <ul>
        <li>Next.js 14</li>
        <li>TypeScript</li>
        <li>Tailwind CSS</li>
        <li>Prisma ORM</li>
        <li>PostgreSQL</li>
        <li>Stripe Integration</li>
      </ul>
    `,
    price: 1500000,
    originalPrice: 2000000,
    rating: 4.8,
    reviewCount: 134,
    category: "Source Code",
    images: ["/nextjs-saas-dashboard.png", "/placeholder-h7ony.png"],
    seller: {
      name: "CodeMaster",
      rating: 4.7,
      totalSales: 456,
      joinDate: "2023-05-10",
      avatar: "/seller-avatar-1.png",
    },
    specifications: {
      Framework: "Next.js 14",
      Language: "TypeScript",
      Styling: "Tailwind CSS",
      Database: "PostgreSQL + Prisma",
      Authentication: "NextAuth.js",
      Payment: "Stripe",
      Documentation: "Đầy đủ + Video hướng dẫn",
    },
    tags: ["Next.js", "SaaS", "Dashboard", "TypeScript", "Premium"],
    inStock: true,
    stockCount: 8,
    isHot: true,
  },
  "7": {
    id: "7",
    title: "Visual Studio Code Pro",
    description: "Bản quyền Visual Studio Code với extensions premium và themes độc quyền",
    fullDescription: `
      <h3>Bao gồm:</h3>
      <ul>
        <li>VS Code với license thương mại</li>
        <li>Premium extensions pack</li>
        <li>Exclusive themes collection</li>
        <li>Advanced debugging tools</li>
        <li>Team collaboration features</li>
      </ul>
    `,
    price: 250000,
    rating: 4.5,
    reviewCount: 67,
    category: "IDE & Tools",
    images: ["/placeholder-h7ony.png"],
    seller: {
      name: "DevTools",
      rating: 4.8,
      totalSales: 890,
      joinDate: "2023-03-20",
      avatar: "/seller-avatar-2.png",
    },
    specifications: {
      Editor: "Visual Studio Code",
      License: "Commercial",
      Extensions: "50+ Premium",
      Themes: "20+ Exclusive",
      Support: "1 năm",
    },
    tags: ["VS Code", "Editor", "Premium", "Extensions"],
    inStock: true,
    stockCount: 25,
    isHot: false,
  },
  "8": {
    id: "8",
    title: "Flutter Mobile App Template",
    description: "Template Flutter hoàn chỉnh cho ứng dụng mobile với backend Firebase",
    fullDescription: `
      <h3>Tính năng app:</h3>
      <ul>
        <li>Flutter cross-platform</li>
        <li>Firebase backend</li>
        <li>User authentication</li>
        <li>Push notifications</li>
        <li>In-app purchases</li>
        <li>Social media integration</li>
        <li>Offline support</li>
      </ul>
    `,
    price: 950000,
    rating: 4.7,
    reviewCount: 89,
    category: "Source Code",
    images: ["/placeholder-h7ony.png"],
    seller: {
      name: "MobileDevs",
      rating: 4.6,
      totalSales: 234,
      joinDate: "2023-07-15",
      avatar: "/seller-avatar-1.png",
    },
    specifications: {
      Framework: "Flutter",
      Backend: "Firebase",
      Platform: "iOS + Android",
      Features: "Authentication, Push, IAP",
      Documentation: "Đầy đủ",
    },
    tags: ["Flutter", "Mobile", "Firebase", "Cross-platform"],
    inStock: true,
    stockCount: 15,
    isHot: false,
  },
}

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await accountApi.getById(params.id)
        
        if (response.success && response.data) {
          // Transform API data to match component interface
          const transformedProduct = {
            id: response.data.id,
            title: response.data.title,
            description: response.data.description,
            fullDescription: response.data.fullDescription || response.data.description,
            price: response.data.price,
            originalPrice: response.data.originalPrice,
            rating: response.data.rating || 4.5,
            reviewCount: response.data.reviewCount || 0,
            category: response.data.category,
            images: response.data.imagepreview ? [response.data.imagepreview] : ["/placeholder-h7ony.png"],
            seller: {
              name: response.data.seller || "ZuneF Store",
              rating: 4.8,
              totalSales: 100,
              joinDate: "2023-01-01",
              avatar: "/seller-avatar-1.png",
            },
            specifications: response.data.specifications || {},
            tags: response.data.tags || [],
            inStock: response.data.inStock !== false,
            stockCount: response.data.stockCount || 10,
            isHot: response.data.isHot || false,
          }
          setProduct(transformedProduct)
        } else {
          // Fallback to mock data if API fails
          const mockProduct = mockProducts[params.id as keyof typeof mockProducts]
          if (mockProduct) {
            setProduct(mockProduct)
          } else {
            setError("Sản phẩm không tồn tại")
          }
        }
      } catch (err: any) {
        console.error("Error fetching product:", err)
        // Fallback to mock data on error
        const mockProduct = mockProducts[params.id as keyof typeof mockProducts]
        if (mockProduct) {
          setProduct(mockProduct)
          toast.error("Không thể tải dữ liệu từ server, hiển thị dữ liệu mẫu")
        } else {
          setError("Không thể tải thông tin sản phẩm")
          toast.error("Không thể tải thông tin sản phẩm")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <ProductDetail product={product} />
        <RelatedProducts currentProductId={product.id} category={product.category} />
      </main>
    </div>
  )
}
