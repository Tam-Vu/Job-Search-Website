import CompanyBgDefault from "@/assets/CompanyBgDefault.jpg"
import CompanyDefault from "@/assets/CompanyDefault.png"
import { CiGlobe } from "react-icons/ci"
import { BiBuildings } from "react-icons/bi"
import { FaUsers } from "react-icons/fa"
import { FaMapMarkerAlt } from "react-icons/fa"
import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { companyApi } from "@/apis"
import FroalaViewComponent from "@/components/shared/froalaEditorViewComponent"
import { useAuth } from "@/hooks/useAuth"
import { useState, useMemo } from "react"
import { FaStar, FaRegStar, FaFilter } from "react-icons/fa"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shared/dialog"
import { Button } from "@/components/shared/Button"
import { Textarea } from "@/components/shared/TextArea"
import { Label } from "@/components/shared/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Layout/Components/Select"
import { toast } from "react-toastify"

export const Company = () => {
  const { isLoggedIn } = useAuth()
  const { companyId } = useParams()
  const [openRatingModal, setOpenRatingModal] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [filterRating, setFilterRating] = useState("all")

  // Mock data for comments - in a real app, this would come from an API
  const [comments, setComments] = useState([
    { id: 1, author: "Nguyễn Văn A", rating: 5, comment: "Công ty rất tốt, môi trường làm việc tuyệt vời!", date: "2023-10-15" },
    { id: 2, author: "Trần Thị B", rating: 3, comment: "Công ty ổn, cần cải thiện chế độ phúc lợi.", date: "2023-10-12" },
    { id: 3, author: "Lê Văn C", rating: 4, comment: "Đội ngũ thân thiện, quy trình làm việc chuyên nghiệp.", date: "2023-09-28" },
    { id: 4, author: "Phạm Thị D", rating: 2, comment: "Áp lực công việc cao, thưởng thấp.", date: "2023-09-20" },
  ])

  const { data: companyData } = useQuery({
    queryKey: ["Companies", companyId],
    queryFn: () => companyApi.getCompanyById(Number(companyId)),
    refetchInterval: (query) => {
      const currentStatus = query.state?.data
      if (currentStatus) {
        return false
      }
      return 300000 // 5 minutes
    },
  })

  const handleSubmitRating = () => {
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá")
      return
    }
    
    // In a real app, this would call an API to save the rating
    const newComment = {
      id: comments.length + 1,
      author: "Bạn",
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    }
    
    setComments([newComment, ...comments])
    toast.success("Đánh giá của bạn đã được ghi nhận")
    setOpenRatingModal(false)
    setRating(0)
    setComment("")
  }

  const filteredComments = useMemo(() => {
    if (filterRating === "all") return comments
    return comments.filter(c => c.rating === parseInt(filterRating))
  }, [comments, filterRating])

  const averageRating = useMemo(() => {
    if (comments.length === 0) return 0
    const sum = comments.reduce((acc, c) => acc + c.rating, 0)
    return (sum / comments.length).toFixed(1)
  }, [comments])

  // Function to render star rating
  const renderStars = (count: number, interactable = false) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (interactable) {
        stars.push(
          <span 
            key={i} 
            className="cursor-pointer" 
            onClick={() => setRating(i)}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
          >
            {i <= (hoverRating || rating) ? 
              <FaStar className="text-yellow-400" size={24} /> : 
              <FaRegStar className="text-gray-400" size={24} />
            }
          </span>
        )
      } else {
        stars.push(
          <span key={i}>
            {i <= count ? 
              <FaStar className="text-yellow-400" size={16} /> : 
              <FaRegStar className="text-gray-400" size={16} />
            }
          </span>
        )
      }
    }
    return stars
  }

  return (
    <div className="flex h-full w-screen flex-col gap-6 bg-background px-[106px]">
      <div className="relative mt-5 max-h-[500px] w-full rounded-xl">
        <img
          src={CompanyDefault}
          className="absolute top-1/2 z-20 ml-[60px] h-[138px] w-[138px] -translate-y-1/4 rounded-full bg-white"
        />
        <img src={CompanyBgDefault} className="w-full rounded-tl-xl rounded-tr-xl" />
        <div className="flex justify-center rounded-bl-xl rounded-br-xl bg-companyCover py-[30px]">
          <div className="flex max-w-[622px] flex-col items-center">
            <span className="text-wrap text-xl font-semibold text-white">{companyData?.DT.companyName}</span>
            <div className="mt-4 flex flex-wrap gap-5">
              <div className="flex items-center">
                <CiGlobe size={18} className="mr-4 text-sm text-white" />
                https://www.facebook.com/CRCVietnamCareer
              </div>
              <div className="flex items-center">
                <BiBuildings size={18} className="mr-4 text-sm text-white" />
                500-1000 nhân viên
              </div>
              <div className="flex items-center">
                <FaUsers size={18} className="mr-4 text-sm text-white" />
                122 người theo dõi
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-wrap gap-[30px]">
        <div className="mb-6 flex h-full max-w-[750px] flex-col rounded-xl bg-white">
          <div className="w-full rounded-tl-xl rounded-tr-xl bg-companyCover px-5 py-3 text-lg font-semibold">
            Giới thiệu công ty
          </div>
          {companyData?.DT.companyDescription !== "" ? (
            <div className="m-5 text-sm text-black">
              <FroalaViewComponent model={companyData?.DT.companyDescription} />
            </div>
          ) : (
            <div className="m-5 text-sm text-black">
              CRC SPORTS – Nhà bán lẻ & phân phối thương hiệu các mặt hàng về thể thao hàng đầu tại Thái Lan và Việt
              Nam. Được thành lập tại Thái Lan vào năm 1997 với tên gọi ban đầu SuperSports. SuperSports Việt Nam là một
              hệ thống thuộc tập đoàn Central Retail hoạt động theo hai hình thức bán lẻ chính: Cửa hàng bán lẻ đồ thể
              thao của các thương hiệu khác nhau có tên là "SuperSports" & Cửa hàng chuyên biệt thương hiệu như Crocs
              hay New Balance. Sở hữu hơn 1200 địa điểm phân phối với hơn 20 thương hiệu thể thao chính thức khác nhau
              trên khắp thế giới như Crocs, New Balance, Fila, Umbro, Adidas, Nike,... SuperSports mang đến rất nhiều
              lựa chọn về giày dép và quần áo, máy tập thể dục và phụ kiện thể thao mang đến sản phẩm chất lượng tốt
              nhất cho các tín đồ đam mê thể thao tại Việt Nam. Cửa hàng bán lẻ: SuperSports, Crocs, New Balance, Fila
              và Skechers. Nhà phân phối: Crocs, Fila, Kambukka, Liverpool FC, PTP Fitness, New Balance, Speedo,
              Skechers, Under Armour và Zoggs
            </div>
          )}
        </div>
        <div className="mb-6 flex h-full w-full flex-col rounded-xl bg-white">
          <div className="w-full rounded-tl-xl rounded-tr-xl bg-companyCover px-5 py-3 text-lg font-semibold">
            Thông tin liên hệ
          </div>
          <div className="m-5 flex flex-col">
            <div className="w-full border-b-[1px] border-desc pb-5">
              <div className="flex gap-[7px]">
                <FaMapMarkerAlt size={20} className="text-navTitle" />
                <span className="text-sm text-black">Địa chỉ công ty</span>
              </div>
              <div className="my-2 w-full text-sm text-desc">163 Phan Đăng Lưu Quận Phú Nhuận Tp Hồ Chí Minh</div>
            </div>
            
            {/* Company Rating Section */}
            <div className="mt-5 flex w-full flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-black">Đánh giá công ty</span>
                  <span className="flex items-center gap-1">
                    {renderStars(Math.round(Number(averageRating)))}
                    <span className="ml-1 text-sm font-medium">({averageRating})</span>
                  </span>
                </div>
                
                {isLoggedIn && (
                  <Dialog open={openRatingModal} onOpenChange={setOpenRatingModal}>
                    <DialogTrigger asChild>
                      <Button className="rounded-md bg-navTitle text-white hover:bg-green-700">
                        Đánh giá
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-96 px-8">
                      <DialogHeader className="flex flex-row items-center justify-center">
                        <DialogTitle className="text-2xl text-navTitle">Đánh giá công ty</DialogTitle>
                      </DialogHeader>
                      
                      <div className="mb-4 flex justify-center">
                        <div className="flex gap-1">{renderStars(0, true)}</div>
                      </div>
                      
                      <Label htmlFor="comment">Nhận xét của bạn</Label>
                      <Textarea
                        id="comment"
                        placeholder="Chia sẻ trải nghiệm của bạn về công ty này..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px] w-full text-black"
                      />
                      
                      <DialogFooter className="flex w-full gap-3 bg-white mt-4">
                        <Button
                          onClick={() => setOpenRatingModal(false)}
                          className="w-full rounded-md bg-red-600 py-2 text-center font-semibold text-white transition-all hover:bg-red-700"
                        >
                          Hủy
                        </Button>
                        <Button
                          onClick={handleSubmitRating}
                          className="w-full rounded-md bg-navTitle py-2 text-center font-semibold text-white transition-all hover:bg-green-700"
                        >
                          Gửi đánh giá
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              {/* Comments filter */}
              <div className="mt-4 flex items-center gap-2">
                <FaFilter size={16} className="text-navTitle" />
                <span className="text-sm font-medium text-black">Lọc theo:</span>
                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger className="h-8 w-32 border-slate-300 bg-white text-black">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="5">5 sao</SelectItem>
                    <SelectItem value="4">4 sao</SelectItem>
                    <SelectItem value="3">3 sao</SelectItem>
                    <SelectItem value="2">2 sao</SelectItem>
                    <SelectItem value="1">1 sao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Comments list */}
              <div className="mt-4 flex flex-col gap-4 max-h-[400px] overflow-y-auto">
                {filteredComments.map((c) => (
                  <div key={c.id} className="border-b border-slate-200 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-black">{c.author}</span>
                      <span className="text-xs text-gray-500">{c.date}</span>
                    </div>
                    <div className="my-1 flex">{renderStars(c.rating)}</div>
                    <p className="text-sm text-black">{c.comment}</p>
                  </div>
                ))}
                
                {filteredComments.length === 0 && (
                  <div className="py-4 text-center text-gray-500">
                    Không có đánh giá nào với bộ lọc hiện tại
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
