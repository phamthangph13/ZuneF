"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Copy, ExternalLink, Key, Mail, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

// Backup mock data for purchased items (will be replaced with API call in future)
const mockPurchasedItems = [
  {
    id: "1",
    name: "ChatGPT Plus Account",
    category: "AI Account",
    type: "account",
    purchaseDate: "2024-01-15",
    price: 500000,
    status: "active",
    credentials: {
      email: "user123@example.com",
      password: "SecurePass123!",
      loginUrl: "https://chat.openai.com",
    },
  },
  {
    id: "2",
    name: "GitHub Copilot License",
    category: "IDE & Tools",
    type: "license",
    purchaseDate: "2024-01-10",
    price: 300000,
    status: "active",
    licenseKey: "GHCP-2024-XXXX-YYYY-ZZZZ",
    downloadUrl: "https://github.com/features/copilot",
  },
  {
    id: "3",
    name: "React E-commerce Template",
    category: "Source Code",
    type: "download",
    purchaseDate: "2024-01-05",
    price: 800000,
    status: "completed",
    downloadUrl: "/downloads/react-ecommerce-template.zip",
    githubRepo: "https://github.com/ZuneF.Com/react-ecommerce",
  },
]

export default function PurchasesPage() {
  const [selectedItem, setSelectedItem] = useState(null)
  const [purchasedItems, setPurchasedItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch purchased items (currently using mock data, will be replaced with API)
  useEffect(() => {
    const fetchPurchasedItems = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // TODO: Replace with actual API call when purchases/orders API is available
        // const response = await purchaseApi.getUserPurchases()
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // For now, use mock data
        setPurchasedItems(mockPurchasedItems)
        
      } catch (err: any) {
        console.error("Error fetching purchased items:", err)
        setError("Không thể tải danh sách đơn hàng")
        toast.error("Không thể tải danh sách đơn hàng")
        // Fallback to mock data
        setPurchasedItems(mockPurchasedItems)
      } finally {
        setLoading(false)
      }
    }

    fetchPurchasedItems()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Đã sao chép vào clipboard!")
  }

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Đang tải xuống...")
  }

  const renderProductAccess = (item: any) => {
    switch (item.type) {
      case "account":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email đăng nhập
                </Label>
                <div className="flex gap-2">
                  <Input value={item.credentials.email} readOnly />
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(item.credentials.email)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Mật khẩu
                </Label>
                <div className="flex gap-2">
                  <Input type="password" value={item.credentials.password} readOnly />
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(item.credentials.password)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Button className="w-full" asChild>
              <a href={item.credentials.loginUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Đăng nhập ngay
              </a>
            </Button>
          </div>
        )

      case "license":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>License Key</Label>
              <div className="flex gap-2">
                <Input value={item.licenseKey} readOnly />
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(item.licenseKey)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button className="w-full" asChild>
              <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Tải xuống & Cài đặt
              </a>
            </Button>
          </div>
        )

      case "download":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button className="w-full" onClick={() => handleDownload(item.downloadUrl, `${item.name}.zip`)}>
                <Download className="h-4 w-4 mr-2" />
                Tải xuống Source Code
              </Button>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <a href={item.githubRepo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Xem trên GitHub
                </a>
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 lg:pl-64">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Đơn hàng đã mua</h1>
            <p className="text-muted-foreground mt-2">Quản lý và truy cập các sản phẩm đã mua</p>
          </div>

          {loading ? (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                        <div className="h-5 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Lỗi tải dữ liệu</h3>
                    <p className="text-muted-foreground">{error}</p>
                  </div>
                  <Button onClick={() => window.location.reload()}>Thử lại</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {purchasedItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{item.name}</CardTitle>
                        <CardDescription>
                          Mua ngày {new Date(item.purchaseDate).toLocaleDateString("vi-VN")} • {item.category}
                        </CardDescription>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge variant={item.status === "active" ? "default" : "secondary"}>
                          {item.status === "active" ? "Đang hoạt động" : "Hoàn thành"}
                        </Badge>
                        <p className="text-lg font-semibold">{item.price.toLocaleString("vi-VN")}đ</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="access" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="access">Truy cập sản phẩm</TabsTrigger>
                        <TabsTrigger value="info">Thông tin đơn hàng</TabsTrigger>
                      </TabsList>
                      <TabsContent value="access" className="mt-4">
                        {renderProductAccess(item)}
                      </TabsContent>
                      <TabsContent value="info" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <Label className="text-muted-foreground">Mã đơn hàng</Label>
                            <p className="font-medium">#{item.id.padStart(6, "0")}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Danh mục</Label>
                            <p className="font-medium">{item.category}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Trạng thái</Label>
                            <p className="font-medium">{item.status === "active" ? "Đang hoạt động" : "Hoàn thành"}</p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {purchasedItems.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Chưa có đơn hàng nào</h3>
                    <p className="text-muted-foreground">
                      Bạn chưa mua sản phẩm nào. Hãy khám phá cửa hàng để tìm sản phẩm phù hợp!
                    </p>
                  </div>
                  <Button asChild>
                    <a href="/">Khám phá sản phẩm</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
