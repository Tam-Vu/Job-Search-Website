import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/shared/dialog"
import { Button } from "@/components/shared/Button"
import { Label } from "@/components/shared/ui/AnimatedHoverLabel"
import { toast } from "react-toastify"
import { useState } from "react"
import { FaStar, FaRegStar } from "react-icons/fa"
import { Textarea } from "@/components/shared/TextArea"
import { resumeApi } from "@/apis"

export const CreateRating = ({
  id,
  openRatingModal,
  setOpenRatingModal,
}: {
  id: number
  openRatingModal: boolean
  setOpenRatingModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá")
      return
    }
    const data = {
      star: rating,
      content: comment,
    }
    const res = await resumeApi.RatingResume(data, id.toString())
    if (res?.EM === "update rating successfully") {
      toast.success("Đánh giá của bạn đã được ghi nhận")
      setOpenRatingModal(false)
      setRating(0)
      setComment("")
    } else {
      toast.error("Đánh giá thất bại")
    }
  }
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
            {i <= (hoverRating || rating) ? (
              <FaStar className="text-yellow-400" size={24} />
            ) : (
              <FaRegStar className="text-gray-400" size={24} />
            )}
          </span>,
        )
      } else {
        stars.push(
          <span key={i}>
            {i <= count ? (
              <FaStar className="text-yellow-400" size={16} />
            ) : (
              <FaRegStar className="text-gray-400" size={16} />
            )}
          </span>,
        )
      }
    }
    return stars
  }
  return (
    <Dialog key={id} open={openRatingModal} onOpenChange={setOpenRatingModal}>
      <DialogContent className="w-96 px-8">
        <DialogHeader className="flex flex-row items-center justify-center">
          <DialogTitle className="text-2xl text-navTitle">Đánh giá CV</DialogTitle>
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

        <DialogFooter className="mt-4 flex w-full gap-3 bg-white">
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
  )
}
