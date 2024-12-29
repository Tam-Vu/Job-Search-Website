import { useState } from "react";
import { FaBell } from "react-icons/fa";

interface NotificationButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}
export default function NotificationButton({ ...props }: NotificationButton) {
    const [isVisible, setIsVisible] = useState(false);

    const toggleNotification = () => {
        setIsVisible(!isVisible);
    };
return (
        <div className="relative">
            <FaBell size={20} className="text-[#00b14f]" onClick={toggleNotification}/>
            {isVisible && (
                <div className="absolute right-0 mt-2 w-[320px] p-2 bg-white border rounded shadow-lg z-[100]">
                    <p className="text-[16px] text-black font-[550]">Thông báo</p>
                    <hr className="mb-2"/>
                    <p className="text-[16px] text-black">Human Gate 3i, Công ty TNHH 1 thành viên công nghệ và truyền thông 3i, Vừa xem CV của bạn</p>
                    <p>Thông báo 3</p>
                </div>
            )}
        </div>
    );
}
  