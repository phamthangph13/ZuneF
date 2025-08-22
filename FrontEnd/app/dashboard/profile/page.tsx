"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, Loader2 } from "lucide-react"
import { fileApi } from "@/lib/api"
import { toast } from "sonner"

export default function ProfilePage() {
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg")
  const [isUploading, setIsUploading] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0123456789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    bio: "Tôi là một developer đam mê công nghệ..."
  })

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fileApi.uploadSingle(file)
        if (response.success) {
          setAvatarUrl(`/api/files/${response.data.fileId}`)
          toast.success("Cập nhật ảnh đại diện thành công!")
        } else {
          toast.error("Lỗi upload ảnh đại diện")
        }
    } catch (error) {
      toast.error("Lỗi kết nối đến server")
    } finally {
      setIsUploading(false)
    }
  }

  const handleProfileUpdate = async () => {
    try {
      // Here you would call an API to update profile
      toast.success("Cập nhật thông tin thành công!")
    } catch (error) {
      toast.error("Lỗi cập nhật thông tin")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <div className="lg:pl-64">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Thông tin tài khoản</h1>
            <p className="text-muted-foreground">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle>Ảnh đại diện</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 cursor-pointer">
                    <Button size="sm" className="rounded-full h-8 w-8 p-0" disabled={isUploading}>
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </Button>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={isUploading}
                  />
                </div>
                <label htmlFor="avatar-upload">
                  <Button variant="outline" size="sm" disabled={isUploading} asChild>
                    <span className="cursor-pointer">
                      {isUploading ? "Đang tải lên..." : "Thay đổi ảnh"}
                    </span>
                  </Button>
                </label>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Họ</Label>
                      <Input id="firstName" defaultValue="Nguyễn" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Tên</Label>
                      <Input id="lastName" defaultValue="Văn A" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="user@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" defaultValue="+84 123 456 789" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Giới thiệu</Label>
                    <Textarea
                      id="bio"
                      placeholder="Viết vài dòng giới thiệu về bản thân..."
                      defaultValue="Developer với 5 năm kinh nghiệm trong lĩnh vực web development và AI."
                    />
                  </div>

                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin bán hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Tên shop</Label>
                    <Input id="shopName" defaultValue="TechStore" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shopDescription">Mô tả shop</Label>
                    <Textarea
                      id="shopDescription"
                      placeholder="Mô tả về shop của bạn..."
                      defaultValue="Chuyên cung cấp tài khoản AI và công cụ phát triển chất lượng cao."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankAccount">Số tài khoản</Label>
                      <Input id="bankAccount" defaultValue="1234567890" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Ngân hàng</Label>
                      <Input id="bankName" defaultValue="Vietcombank" />
                    </div>
                  </div>

                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Cập nhật thông tin
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
