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

export const Company = () => {
  const { isLoggedIn } = useAuth()
  console.log("isLoggedIn", isLoggedIn)
  const { companyId } = useParams()
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
      <div className="flex w-full gap-[30px]">
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
              thao của các thương hiệu khác nhau có tên là “SuperSports” & Cửa hàng chuyên biệt thương hiệu như Crocs
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
          </div>
        </div>
      </div>
    </div>
  )
}
