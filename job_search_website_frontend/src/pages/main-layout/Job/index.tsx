import { GrMoney } from "react-icons/gr"
import { FaMapMarkerAlt } from "react-icons/fa"
import { CgSandClock } from "react-icons/cg"
import { TbClockFilled } from "react-icons/tb"
import { FaRegPaperPlane } from "react-icons/fa"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from "@/components/shared/ui/AnimatedModal"
import CompanyDefault from "@/assets/CompanyDefault.png"
import { FaArrowUpRightFromSquare } from "react-icons/fa6"
import { useNavigate } from "react-router"
import { PiMedalFill } from "react-icons/pi"
import { FaUsers } from "react-icons/fa"
import { MdWorkHistory } from "react-icons/md"
import { PiFoldersFill } from "react-icons/pi"
import { IoCloudUploadOutline } from "react-icons/io5"
import { Button } from "@/components/shared/Button"

export const Job = () => {
  const navigate = useNavigate()
  return (
    <div className="mt-5 grid h-full w-screen grid-cols-6 gap-6 bg-background px-[106px]">
      <div className="col-span-4 flex w-full flex-col gap-6">
        <div className="flex w-full flex-col rounded-md bg-white px-6 py-5">
          <span className="text-wrap text-xl font-bold text-black">
            Chăm Sóc Khách Hàng/ Customer Service - Tiếng Anh/ English (Làm Việc 6 Tiếng/ Ngày - Quận 11)
          </span>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-4">
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
                <GrMoney className="text-white" size={20} />
              </div>

              <div className="flex flex-col">
                <span className="mb-1 text-sm text-black">Mức lương</span>
                <span className="text-sm font-semibold text-black">8 - 11 triệu</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
                <FaMapMarkerAlt className="text-white" size={20} />
              </div>

              <div className="flex flex-col">
                <span className="mb-1 text-sm text-black">Địa điểm</span>
                <span className="text-sm font-semibold text-black">Hồ Chí Minh</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
                <CgSandClock className="text-white" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="mb-1 text-sm text-black">Kinh nghiệm</span>
                <span className="text-sm font-semibold text-black">Dưới 1 năm</span>
              </div>
            </div>
          </div>
          <span className="mt-4 flex w-fit items-center rounded-md bg-background px-2 py-1 text-sm text-black">
            <TbClockFilled size={20} className="mr-2 text-companyJobCard" />
            Hạn nộp hồ sơ: 01/12/2024
          </span>
          <Modal>
            <ModalTrigger className="group/modal-btn mt-4 flex w-full items-center justify-center rounded-md bg-navTitle py-2 font-semibold text-white">
              <div className="absolute inset-0 z-20 flex -translate-x-full items-center justify-center text-white transition duration-500 group-hover/modal-btn:translate-x-0">
                <FaRegPaperPlane size={20} />
              </div>
              <span className="text-center transition duration-500 group-hover/modal-btn:translate-x-[1000px]">
                Ứng tuyển ngay
              </span>
            </ModalTrigger>
            <ModalBody className="min-w-[648px] px-8">
              <ModalContent className="w-full justify-start p-0">
                <div className="flex w-full flex-col">
                  <span className="mb-9 text-lg font-bold text-black">
                    Ứng tuyển{" "}
                    <span className="text-navTitle">
                      Chăm Sóc Khách Hàng/ Customer Service - Tiếng Anh/ English (Làm Việc 6 Tiếng/ Ngày - Quận 11)
                    </span>
                  </span>
                  <span className="flex text-[16px] font-semibold text-black">
                    <PiFoldersFill size={20} className="mr-2 text-navTitle" /> Chọn CV để ứng tuyển
                  </span>
                  <div className="mt-5 flex flex-col items-center justify-center">
                    <span className="flex items-center justify-center text-sm font-semibold text-black">
                      <IoCloudUploadOutline className="h-[28px] w-[42px] text-companyJobCard" />
                      Tải lên CV từ máy tính, chọn hoặc kéo thả
                    </span>
                    <span className="mt-2 w-full text-center text-sm text-companyJobCard">
                      Hỗ trợ định dạng .doc, .docx, pdf có kích thước dưới 5MB
                    </span>
                    <Button className="mt-2 w-fit rounded-md bg-backgroundColor px-6 text-center text-sm font-semibold text-black transition-all hover:bg-navTitle hover:text-white">
                      Chọn CV
                    </Button>
                  </div>
                </div>
              </ModalContent>
              <ModalFooter className="flex w-full gap-3 bg-white">
                <Button className="rounded-md bg-backgroundColor px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-gray-300">
                  Hủy
                </Button>
                <Button className="w-full rounded-md bg-navTitle py-2 text-center font-semibold text-white transition-all hover:bg-green-700">
                  Nộp hồ sơ ứng tuyển
                </Button>
              </ModalFooter>
            </ModalBody>
          </Modal>
        </div>
        <div className="flex w-full flex-col rounded-md bg-white px-6 py-5">
          <span className="border-l-4 border-navTitle pl-[10px] text-xl font-bold text-black">
            Chi tiết tin tuyển dụng
          </span>
          <span className="mt-6 text-[16px] font-semibold text-black">Mô tả công việc</span>
          <span className="mt-[10px] text-wrap text-sm text-black">
            - Tiếp nhận các yêu cầu về tra cứu thông tin, đặt lịch hẹn thông qua việc nhận cuộc gọi, trò truyện trực
            tuyến, trả lời email, tin nhắn văn bản..., trên nền tảng/ứng dụng.
          </span>
          <span className="mt-[10px] text-wrap text-sm text-black">
            - Đáp ứng chỉ tiêu và năng suất đề ra của dự án
          </span>
          <span className="mt-[10px] text-wrap text-sm font-bold text-black">
            Thời gian làm việc: (chọn 1 ca làm việc phù hợp)
          </span>
          <span className="mt-[10px] text-wrap text-sm font-bold text-black">
            - Ca sáng 8H - 14H (6 ngày/ tuần, nghỉ 1 ngày)
          </span>
          <span className="mt-[10px] text-wrap text-sm font-bold text-black">
            - Ca chiều 14H - 20H (6 ngày/ tuần, nghỉ 1 ngày)
          </span>
          <span className="mt-[10px] text-wrap text-sm font-bold text-black">
            Thu nhập: 8 - 10 triệu (lương + phụ cấp) + thưởng dự án + phụ cấp ca chiều
          </span>
          <span className="mt-[10px] text-wrap text-sm text-black">
            <span className="font-bold">Địa điểm làm việc: </span>Văn phòng quận 11 - Cao ốc Khải Hoàn - 624 Lạc Long
            Quân, Phường 5, Quận 11
          </span>
          <span className="mt-6 text-[16px] font-semibold text-black">Yêu cầu ứng viên</span>
          <span className="mt-[10px] text-wrap text-sm text-black">- Tiếng Anh thành thạo (đọc, viết tốt)</span>
          <span className="mt-[10px] text-wrap text-sm text-black">
            - Có kinh nghiệm chăm sóc khách hàng từ 6 tháng trở lên
          </span>
          <span className="mt-6 text-wrap text-sm font-bold text-black">Địa điểm làm việc</span>
          <span className="mt-[10px] text-wrap text-sm text-black">
            - Hồ Chí Minh: Văn phòng quận 11 - Cao ốc Khải Hoàn - 624 Lạc Long Quân, Phường 5, Quận 11
          </span>
          <span className="mt-6 text-wrap text-sm font-bold text-black">Cách thức ứng tuyển</span>
          <span className="mt-[10px] text-wrap text-sm text-black">
            Ứng viên nộp hồ sơ trực tuyến bằng cách bấm Ứng tuyển bên trên.
          </span>
          <span className="mt-[10px] text-wrap text-sm text-black">Hạn nộp hồ sơ: 01/12/2024</span>
        </div>
      </div>
      <div className="col-span-2 flex w-full flex-col gap-6">
        <div className="flex w-full flex-col rounded-md bg-white px-6 py-5">
          <div className="flex">
            <img src={CompanyDefault} className="mr-2 h-[74px] w-[74px] cursor-pointer" />
            <span className="text-[16px] font-semibold text-black">
              Công ty Trách Nhiệm Hữu Hạn Một Thành Viên Thương Mại Thời Trang Tổng Hợp
            </span>
          </div>
          <div className="mt-3 flex items-center">
            <span className="mr-4 text-companyJobCard">Quy mô:</span>
            <span className="font-medium text-black">1000+ nhân viên</span>
          </div>
          <div className="mt-2 flex items-center">
            <span className="mr-4 text-companyJobCard">Lĩnh vực:</span>
            <span className="font-medium text-black">IT - Phần mềm</span>
          </div>
          <div className="mt-2 flex items-center">
            <span className="mr-4 text-companyJobCard">Địa điểm:</span>
            <span className="font-medium text-black">CVPM Quang Trung</span>
          </div>
          <span
            onClick={() => navigate("/cong-ty")}
            className="mt-4 flex w-full cursor-pointer items-center justify-center text-center text-sm font-semibold text-navTitle"
          >
            Xem trang công ty
            <FaArrowUpRightFromSquare size={16} className="ml-2" />
          </span>
        </div>
        <div className="flex w-full flex-col rounded-md bg-white px-6 py-5">
          <span className="font-bold text-black">Thông tin chung</span>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
              <PiMedalFill className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="mb-1 text-sm text-black">Cấp bậc</span>
              <span className="text-sm font-semibold text-black">Nhân viên</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
              <CgSandClock className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="mb-1 text-sm text-black">Kinh nghiệm</span>
              <span className="text-sm font-semibold text-black">Dưới 1 năm</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
              <FaUsers className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="mb-1 text-sm text-black">Số lượng tuyển</span>
              <span className="text-sm font-semibold text-black">5 người</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
              <MdWorkHistory className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="mb-1 text-sm text-black">Hình thức làm việc</span>
              <span className="text-sm font-semibold text-black">Toàn thời gian</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
