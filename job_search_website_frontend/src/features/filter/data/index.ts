export const category = [
  {
    key: "address",
    name: "Địa điểm",
  },
  {
    key: "salary",
    name: "Mức lương",
  },
  {
    key: "experience",
    name: "Kinh nghiệm",
  },
  {
    key: "jobs",
    name: "Việc làm",
  },
]

export const address = [
  {
    key: "TPHCM",
    name: "Thành phố Hồ Chí Minh",
  },
  {
    key: "Q1",
    name: "Quận 1",
  },
  {
    key: "Q2",
    name: "Quận 2",
  },
  {
    key: "Q3",
    name: "Quận 3",
  },
  {
    key: "Q4",
    name: "Quận 4",
  },
  {
    key: "Q5",
    name: "Quận 5",
  },
  {
    key: "Q6",
    name: "Quận 6",
  },
  {
    key: "Q7",
    name: "Quận 7",
  },
  {
    key: "Q8",
    name: "Quận 8",
  },
  {
    key: "Q9",
    name: "Quận 9",
  },
  {
    key: "Q10",
    name: "Quận 10",
  },
  {
    key: "Q11",
    name: "Quận 11",
  },
  {
    key: "Q12",
    name: "Quận 12",
  },
  {
    key: "THU_DUC",
    name: "Thủ Đức",
  },
  {
    key: "GO_VAP",
    name: "Gò Vấp",
  },
  {
    key: "BINH_THANH",
    name: "Bình Thạnh",
  },
  {
    key: "TAN_BINH",
    name: "Tân Bình",
  },
  {
    key: "TAN_PHU",
    name: "Tân Phú",
  },
  {
    key: "PHU_NHUAN",
    name: "Phú Nhuận",
  },
  {
    key: "BINH_TAN",
    name: "Bình Tân",
  },
  {
    key: "CU_CHI",
    name: "Củ Chi",
  },
  {
    key: "BINH_CHANH",
    name: "Bình Chánh",
  },
  {
    key: "HOC_MON",
    name: "Hóc Môn",
  },
  {
    key: "NHA_BE",
    name: "Nhà Bè",
  },
  {
    key: "CAN_GIO",
    name: "Cần Giờ",
  },
]
export const salary = [
  { key: "all", name: "Tất cả" },
  { key: "under_10", name: "Dưới 10 triệu" },
  { key: "10_15", name: "Từ 10 - 15 triệu" },
  { key: "15_20", name: "Từ 15 - 20 triệu" },
  { key: "20_25", name: "Từ 20 - 25 triệu" },
  { key: "25_30", name: "Từ 25 - 30 triệu" },
  { key: "30_50", name: "Từ 30 - 50 triệu" },
  { key: "above_50", name: "Trên 50 triệu" },
  { key: "negotiable", name: "Thỏa thuận" },
]
export const experience = [
  { key: "all", name: "Tất cả" },
  { key: "no_experience", name: "Chưa có kinh nghiệm" },
  { key: "under_1", name: "1 năm trở xuống" },
  { key: "2_years", name: "2 năm" },
  { key: "3_years", name: "3 năm" },
  { key: "4_5_years", name: "Từ 4-5 năm" },
  { key: "above_5", name: "Trên 5 năm" },
]
export const jobs = [
  { key: "all", name: "Tất cả" },
  { key: "software_it", name: "IT phần mềm" },
  { key: "information_technology", name: "Công nghệ thông tin" },
  { key: "business_sales", name: "Kinh doanh / Bán hàng" },
  { key: "marketing_communication_advertising", name: "Marketing / Truyền thông / Quảng cáo" },
  { key: "administrative_office", name: "Hành chính / Văn phòng" },
  { key: "customer_service", name: "Dịch vụ khách hàng" },
]

export const jobFields = [
  { key: "it", name: "Công nghệ thông tin" },
  { key: "business_sales", name: "Kinh doanh/Bán hàng" },
  { key: "marketing_pr_advertising", name: "Marketing/PR/Quảng cáo" },
  { key: "customer_service_operations", name: "Dịch vụ khách hàng/Vận hành" },
  { key: "hr_admin_legal", name: "Nhân sự/Hành chính/Pháp chế" },
  { key: "finance_banking_insurance", name: "Tài chính/Ngân hàng/Bảo hiểm" },
  { key: "real_estate_construction", name: "Bất động sản/Xây dựng" },
  { key: "accounting_audit_tax", name: "Kế toán/Kiểm toán/Thuế" },
  { key: "manufacturing", name: "Sản xuất" },
  { key: "education", name: "Giáo dục" },
  { key: "retail_life_services", name: "Bán lẻ/Dịch vụ đời sống" },
  { key: "film_tv_journalism_publishing", name: "Phim và truyền hình/Báo chí/Xuất bản" },
  { key: "electricity_electronics_telecommunications", name: "Điện/Điện tử/Viễn thông" },
  { key: "logistics_driver", name: "Logistics/Tài xế" },
  { key: "law_translation", name: "Luật/Biên phiên dịch" },
  { key: "pharmacy_healthcare", name: "Dược/ Y tế/ Sức khỏe" },
  { key: "design", name: "Thiết kế" },
  { key: "tourism_services", name: "Du lịch/Dịch vụ" },
  { key: "environment_agriculture", name: "Môi trường/Nông nghiệp" },
]

export const Industries = [
  // IT Field
  { key: "software", name: "Kĩ sư phần mềm", jobField: "it" },
  { key: "testing", name: "Kĩ sư kiểm thử", jobField: "it" },
  { key: "network_engineer", name: "Kĩ sư mạng", jobField: "it" },
  { key: "devops", name: "Kĩ sư DevOps", jobField: "it" },
  { key: "system_admin", name: "Quản trị hệ thống", jobField: "it" },
  { key: "data_scientist", name: "Nhà khoa học dữ liệu", jobField: "it" },
  { key: "backend_dev", name: "Lập trình viên backend", jobField: "it" },
  { key: "frontend_dev", name: "Lập trình viên frontend", jobField: "it" },

  // Business/Sales Field
  { key: "sales_rep", name: "Nhân viên bán hàng", jobField: "business_sales" },
  { key: "sales_manager", name: "Quản lý bán hàng", jobField: "business_sales" },
  { key: "business_analyst", name: "Nhà phân tích kinh doanh", jobField: "business_sales" },
  { key: "account_manager", name: "Quản lý tài khoản", jobField: "business_sales" },
  { key: "product_manager", name: "Quản lý sản phẩm", jobField: "business_sales" },
  { key: "sales_coordinator", name: "Điều phối bán hàng", jobField: "business_sales" },
  { key: "regional_sales", name: "Nhân viên bán hàng khu vực", jobField: "business_sales" },
  { key: "business_development", name: "Phát triển kinh doanh", jobField: "business_sales" },

  // Marketing/PR/Advertising Field
  { key: "digital_marketing", name: "Chuyên viên marketing kỹ thuật số", jobField: "marketing_pr_advertising" },
  { key: "seo_specialist", name: "Chuyên viên SEO", jobField: "marketing_pr_advertising" },
  { key: "content_writer", name: "Nhà viết nội dung", jobField: "marketing_pr_advertising" },
  { key: "social_media_manager", name: "Quản lý mạng xã hội", jobField: "marketing_pr_advertising" },
  { key: "pr_specialist", name: "Chuyên viên PR", jobField: "marketing_pr_advertising" },
  { key: "brand_manager", name: "Quản lý thương hiệu", jobField: "marketing_pr_advertising" },
  { key: "market_research", name: "Nghiên cứu thị trường", jobField: "marketing_pr_advertising" },
  { key: "advertising_executive", name: "Chuyên viên quảng cáo", jobField: "marketing_pr_advertising" },

  // Customer Service/Operations Field
  { key: "customer_service_rep", name: "Nhân viên dịch vụ khách hàng", jobField: "customer_service_operations" },
  { key: "call_center_agent", name: "Nhân viên trung tâm cuộc gọi", jobField: "customer_service_operations" },
  { key: "client_relations", name: "Quan hệ khách hàng", jobField: "customer_service_operations" },
  { key: "operations_manager", name: "Quản lý vận hành", jobField: "customer_service_operations" },
  { key: "support_specialist", name: "Chuyên viên hỗ trợ", jobField: "customer_service_operations" },
  { key: "service_coordinator", name: "Điều phối dịch vụ", jobField: "customer_service_operations" },
  { key: "customer_success", name: "Chuyên viên thành công khách hàng", jobField: "customer_service_operations" },
  { key: "technical_support", name: "Hỗ trợ kỹ thuật", jobField: "customer_service_operations" },

  // HR/Admin/Legal Field
  { key: "hr_generalist", name: "Chuyên viên nhân sự", jobField: "hr_admin_legal" },
  { key: "recruiter", name: "Nhà tuyển dụng", jobField: "hr_admin_legal" },
  { key: "hr_manager", name: "Quản lý nhân sự", jobField: "hr_admin_legal" },
  { key: "office_admin", name: "Quản trị văn phòng", jobField: "hr_admin_legal" },
  { key: "legal_assistant", name: "Trợ lý pháp lý", jobField: "hr_admin_legal" },
  { key: "payroll_specialist", name: "Chuyên viên tính lương", jobField: "hr_admin_legal" },
  { key: "compliance_officer", name: "Nhân viên tuân thủ", jobField: "hr_admin_legal" },
  { key: "labor_relations", name: "Quan hệ lao động", jobField: "hr_admin_legal" },

  // Finance/Banking/Insurance Field
  { key: "accountant", name: "Kế toán viên", jobField: "finance_banking_insurance" },
  { key: "financial_analyst", name: "Chuyên viên phân tích tài chính", jobField: "finance_banking_insurance" },
  { key: "loan_officer", name: "Nhân viên tín dụng", jobField: "finance_banking_insurance" },
  { key: "investment_banker", name: "Chuyên viên ngân hàng đầu tư", jobField: "finance_banking_insurance" },
  { key: "insurance_agent", name: "Đại lý bảo hiểm", jobField: "finance_banking_insurance" },
  { key: "auditor", name: "Kiểm toán viên", jobField: "finance_banking_insurance" },
  { key: "tax_specialist", name: "Chuyên viên thuế", jobField: "finance_banking_insurance" },
  { key: "risk_manager", name: "Quản lý rủi ro", jobField: "finance_banking_insurance" },

  // Add additional fields in a similar way to cover all jobFields with 8 jobs each

  // Real Estate/Construction Field
  { key: "real_estate_agent", name: "Nhân viên bất động sản", jobField: "real_estate_construction" },
  { key: "construction_manager", name: "Quản lý xây dựng", jobField: "real_estate_construction" },
  { key: "civil_engineer", name: "Kỹ sư xây dựng dân dụng", jobField: "real_estate_construction" },
  { key: "site_supervisor", name: "Giám sát công trình", jobField: "real_estate_construction" },
  { key: "architect", name: "Kiến trúc sư", jobField: "real_estate_construction" },
  { key: "quantity_surveyor", name: "Chuyên viên dự toán", jobField: "real_estate_construction" },
  { key: "interior_designer", name: "Nhà thiết kế nội thất", jobField: "real_estate_construction" },
  { key: "construction_worker", name: "Công nhân xây dựng", jobField: "real_estate_construction" },

  // Accounting/Audit/Tax Field
  { key: "accountant", name: "Kế toán viên", jobField: "accounting_audit_tax" },
  { key: "auditor", name: "Kiểm toán viên", jobField: "accounting_audit_tax" },
  { key: "tax_consultant", name: "Tư vấn thuế", jobField: "accounting_audit_tax" },
  { key: "financial_controller", name: "Kiểm soát viên tài chính", jobField: "accounting_audit_tax" },
  { key: "budget_analyst", name: "Nhà phân tích ngân sách", jobField: "accounting_audit_tax" },
  { key: "payroll_accountant", name: "Kế toán tiền lương", jobField: "accounting_audit_tax" },
  { key: "forensic_accountant", name: "Kế toán pháp y", jobField: "accounting_audit_tax" },
  { key: "accounts_payable", name: "Chuyên viên tài khoản phải trả", jobField: "accounting_audit_tax" },

  // Manufacturing Field
  { key: "production_manager", name: "Quản lý sản xuất", jobField: "manufacturing" },
  { key: "quality_control", name: "Kiểm soát chất lượng", jobField: "manufacturing" },
  { key: "machinist", name: "Thợ máy", jobField: "manufacturing" },
  { key: "assembly_worker", name: "Công nhân lắp ráp", jobField: "manufacturing" },
  { key: "maintenance_technician", name: "Kỹ thuật viên bảo trì", jobField: "manufacturing" },
  { key: "production_planner", name: "Nhân viên lập kế hoạch sản xuất", jobField: "manufacturing" },
  { key: "safety_officer", name: "Nhân viên an toàn", jobField: "manufacturing" },
  { key: "manufacturing_engineer", name: "Kỹ sư sản xuất", jobField: "manufacturing" },

  // Education Field
  { key: "teacher", name: "Giáo viên", jobField: "education" },
  { key: "school_principal", name: "Hiệu trưởng", jobField: "education" },
  { key: "academic_advisor", name: "Cố vấn học thuật", jobField: "education" },
  { key: "counselor", name: "Tư vấn viên", jobField: "education" },
  { key: "librarian", name: "Thủ thư", jobField: "education" },
  { key: "educational_researcher", name: "Nhà nghiên cứu giáo dục", jobField: "education" },
  { key: "tutor", name: "Gia sư", jobField: "education" },
  { key: "curriculum_developer", name: "Chuyên viên phát triển chương trình học", jobField: "education" },

  // Retail/Life Services Field
  { key: "retail_manager", name: "Quản lý bán lẻ", jobField: "retail_life_services" },
  { key: "cashier", name: "Thu ngân", jobField: "retail_life_services" },
  { key: "store_associate", name: "Nhân viên cửa hàng", jobField: "retail_life_services" },
  { key: "visual_merchandiser", name: "Nhà trang trí hàng hóa", jobField: "retail_life_services" },
  { key: "inventory_specialist", name: "Chuyên viên quản lý hàng tồn kho", jobField: "retail_life_services" },
  { key: "customer_service_rep", name: "Nhân viên dịch vụ khách hàng", jobField: "retail_life_services" },
  { key: "delivery_driver", name: "Tài xế giao hàng", jobField: "retail_life_services" },
  { key: "sales_assistant", name: "Trợ lý bán hàng", jobField: "retail_life_services" },

  // Film/TV/Journalism/Publishing Field
  { key: "film_director", name: "Đạo diễn phim", jobField: "film_tv_journalism_publishing" },
  { key: "producer", name: "Nhà sản xuất", jobField: "film_tv_journalism_publishing" },
  { key: "journalist", name: "Nhà báo", jobField: "film_tv_journalism_publishing" },
  { key: "editor", name: "Biên tập viên", jobField: "film_tv_journalism_publishing" },
  { key: "screenwriter", name: "Biên kịch", jobField: "film_tv_journalism_publishing" },
  { key: "news_anchor", name: "Phát thanh viên", jobField: "film_tv_journalism_publishing" },
  { key: "camera_operator", name: "Người quay phim", jobField: "film_tv_journalism_publishing" },
  { key: "sound_technician", name: "Kỹ thuật viên âm thanh", jobField: "film_tv_journalism_publishing" },

  // Electricity/Electronics/Telecommunications Field
  { key: "electrician", name: "Thợ điện", jobField: "electricity_electronics_telecommunications" },
  {
    key: "electronics_technician",
    name: "Kỹ thuật viên điện tử",
    jobField: "electricity_electronics_telecommunications",
  },
  { key: "telecom_engineer", name: "Kỹ sư viễn thông", jobField: "electricity_electronics_telecommunications" },
  {
    key: "field_technician",
    name: "Kỹ thuật viên hiện trường",
    jobField: "electricity_electronics_telecommunications",
  },
  { key: "network_admin", name: "Quản trị mạng", jobField: "electricity_electronics_telecommunications" },
  { key: "cable_installer", name: "Nhân viên lắp đặt cáp", jobField: "electricity_electronics_telecommunications" },
  { key: "signal_technician", name: "Kỹ thuật viên tín hiệu", jobField: "electricity_electronics_telecommunications" },
  {
    key: "fiber_optic_technician",
    name: "Kỹ thuật viên sợi quang",
    jobField: "electricity_electronics_telecommunications",
  },

  // Logistics/Driver Field
  { key: "truck_driver", name: "Tài xế xe tải", jobField: "logistics_driver" },
  { key: "logistics_coordinator", name: "Điều phối viên logistics", jobField: "logistics_driver" },
  { key: "supply_chain_manager", name: "Quản lý chuỗi cung ứng", jobField: "logistics_driver" },
  { key: "warehouse_worker", name: "Nhân viên kho", jobField: "logistics_driver" },
  { key: "freight_forwarder", name: "Nhân viên giao nhận hàng hóa", jobField: "logistics_driver" },
  { key: "dispatcher", name: "Điều phối viên", jobField: "logistics_driver" },
  { key: "courier", name: "Nhân viên giao hàng", jobField: "logistics_driver" },
  { key: "fleet_manager", name: "Quản lý đội xe", jobField: "logistics_driver" },

  // Law/Translation Field
  { key: "lawyer", name: "Luật sư", jobField: "law_translation" },
  { key: "paralegal", name: "Trợ lý luật sư", jobField: "law_translation" },
  { key: "translator", name: "Biên dịch viên", jobField: "law_translation" },
  { key: "interpreter", name: "Thông dịch viên", jobField: "law_translation" },
  { key: "legal_assistant", name: "Trợ lý pháp lý", jobField: "law_translation" },
  { key: "legal_secretary", name: "Thư ký pháp lý", jobField: "law_translation" },
  { key: "court_clerk", name: "Thư ký tòa án", jobField: "law_translation" },
  { key: "judge", name: "Thẩm phán", jobField: "law_translation" },

  // Pharmacy/Healthcare Field
  { key: "pharmacist", name: "Dược sĩ", jobField: "pharmacy_healthcare" },
  { key: "nurse", name: "Y tá", jobField: "pharmacy_healthcare" },
  { key: "medical_assistant", name: "Trợ lý y tế", jobField: "pharmacy_healthcare" },
  { key: "radiologic_technician", name: "Kỹ thuật viên X-quang", jobField: "pharmacy_healthcare" },
  { key: "physical_therapist", name: "Nhà trị liệu vật lý", jobField: "pharmacy_healthcare" },
  { key: "pharmacy_technician", name: "Kỹ thuật viên dược", jobField: "pharmacy_healthcare" },
  { key: "healthcare_admin", name: "Quản trị viên y tế", jobField: "pharmacy_healthcare" },
  { key: "medical_coder", name: "Nhân viên mã hóa y tế", jobField: "pharmacy_healthcare" },

  // Design Field
  { key: "graphic_designer", name: "Nhà thiết kế đồ họa", jobField: "design" },
  { key: "ui_ux_designer", name: "Nhà thiết kế UI/UX", jobField: "design" },
  { key: "fashion_designer", name: "Nhà thiết kế thời trang", jobField: "design" },
  { key: "interior_designer", name: "Nhà thiết kế nội thất", jobField: "design" },
  { key: "product_designer", name: "Nhà thiết kế sản phẩm", jobField: "design" },
  { key: "illustrator", name: "Họa sĩ minh họa", jobField: "design" },
  { key: "web_designer", name: "Nhà thiết kế web", jobField: "design" },
  { key: "industrial_designer", name: "Nhà thiết kế công nghiệp", jobField: "design" },

  // Tourism/Services Field
  { key: "tour_guide", name: "Hướng dẫn viên du lịch", jobField: "tourism_services" },
  { key: "hotel_manager", name: "Quản lý khách sạn", jobField: "tourism_services" },
  { key: "travel_agent", name: "Nhân viên tư vấn du lịch", jobField: "tourism_services" },
  { key: "flight_attendant", name: "Tiếp viên hàng không", jobField: "tourism_services" },
  { key: "cruise_director", name: "Giám đốc du thuyền", jobField: "tourism_services" },
  { key: "event_planner", name: "Nhân viên tổ chức sự kiện", jobField: "tourism_services" },
  { key: "bartender", name: "Nhân viên pha chế", jobField: "tourism_services" },
  { key: "concierge", name: "Nhân viên lễ tân", jobField: "tourism_services" },

  // Environment/Agriculture Field
  { key: "environmental_scientist", name: "Nhà khoa học môi trường", jobField: "environment_agriculture" },
  { key: "agricultural_engineer", name: "Kỹ sư nông nghiệp", jobField: "environment_agriculture" },
  { key: "forester", name: "Kiểm lâm", jobField: "environment_agriculture" },
  { key: "landscape_architect", name: "Kiến trúc sư cảnh quan", jobField: "environment_agriculture" },
  { key: "horticulturist", name: "Nhà trồng cây cảnh", jobField: "environment_agriculture" },
  { key: "soil_scientist", name: "Nhà khoa học đất", jobField: "environment_agriculture" },
  { key: "conservationist", name: "Nhà bảo tồn", jobField: "environment_agriculture" },
  { key: "veterinarian", name: "Bác sĩ thú y", jobField: "environment_agriculture" },
]

export const professionalPosition = [
  // IT
  {
    key: "backend",
    name: "Lập trình viên Backend",
    jobs: "software",
    jobField: "it",
  },
  {
    key: "frontend",
    name: "Lập trình viên Frontend",
    jobs: "software",
    jobField: "it",
  },
  {
    key: "testing",
    name: "Kỹ sư kiểm thử phần mềm",
    jobs: "testing",
    jobField: "it",
  },
  {
    key: "network_admin",
    name: "Quản trị viên mạng",
    jobs: "network",
    jobField: "it",
  },
  {
    key: "fullstack",
    name: "Lập trình viên Fullstack",
    jobs: "software",
    jobField: "it",
  },
  {
    key: "devops",
    name: "Kỹ sư DevOps",
    jobs: "software",
    jobField: "it",
  },
  {
    key: "qa_engineer",
    name: "Kỹ sư kiểm thử (QA)",
    jobs: "testing",
    jobField: "it",
  },
  {
    key: "cloud_engineer",
    name: "Kỹ sư đám mây",
    jobs: "software",
    jobField: "it",
  },
  {
    key: "it_support",
    name: "Nhân viên hỗ trợ IT",
    jobs: "network",
    jobField: "it",
  },

  // Real Estate / Construction
  {
    key: "construction_manager",
    name: "Quản lý xây dựng",
    jobs: "construction",
    jobField: "real_estate_construction",
  },
  {
    key: "civil_engineer",
    name: "Kỹ sư dân dụng",
    jobs: "construction",
    jobField: "real_estate_construction",
  },
  {
    key: "architect",
    name: "Kiến trúc sư",
    jobs: "construction",
    jobField: "real_estate_construction",
  },
  {
    key: "site_manager",
    name: "Quản lý công trường",
    jobs: "construction",
    jobField: "real_estate_construction",
  },
  {
    key: "real_estate_agent",
    name: "Nhân viên kinh doanh BĐS",
    jobs: "real_estate",
    jobField: "real_estate_construction",
  },
  {
    key: "property_manager",
    name: "Quản lý tài sản",
    jobs: "real_estate",
    jobField: "real_estate_construction",
  },
  {
    key: "broker",
    name: "Môi giới bất động sản",
    jobs: "real_estate",
    jobField: "real_estate_construction",
  },
  {
    key: "investment_analyst",
    name: "Chuyên viên phân tích đầu tư",
    jobs: "real_estate",
    jobField: "real_estate_construction",
  },

  // Accounting / Audit / Tax
  {
    key: "general_accountant",
    name: "Kế toán tổng hợp",
    jobs: "accounting",
    jobField: "accounting_audit_tax",
  },
  {
    key: "payroll_specialist",
    name: "Chuyên viên tiền lương",
    jobs: "accounting",
    jobField: "accounting_audit_tax",
  },
  {
    key: "ar_accountant",
    name: "Kế toán công nợ phải thu",
    jobs: "accounting",
    jobField: "accounting_audit_tax",
  },
  {
    key: "ap_accountant",
    name: "Kế toán công nợ phải trả",
    jobs: "accounting",
    jobField: "accounting_audit_tax",
  },
  {
    key: "internal_auditor",
    name: "Kiểm toán nội bộ",
    jobs: "audit",
    jobField: "accounting_audit_tax",
  },
  {
    key: "external_auditor",
    name: "Kiểm toán độc lập",
    jobs: "audit",
    jobField: "accounting_audit_tax",
  },
  {
    key: "forensic_auditor",
    name: "Kiểm toán pháp lý",
    jobs: "audit",
    jobField: "accounting_audit_tax",
  },
  {
    key: "tax_advisor",
    name: "Cố vấn thuế",
    jobs: "tax",
    jobField: "accounting_audit_tax",
  },

  // Manufacturing
  {
    key: "production_planner",
    name: "Nhà hoạch định sản xuất",
    jobs: "production",
    jobField: "manufacturing",
  },
  {
    key: "quality_control",
    name: "Kỹ sư kiểm tra chất lượng",
    jobs: "production",
    jobField: "manufacturing",
  },
  {
    key: "process_engineer",
    name: "Kỹ sư quy trình sản xuất",
    jobs: "production",
    jobField: "manufacturing",
  },
  {
    key: "manufacturing_manager",
    name: "Quản lý sản xuất",
    jobs: "production",
    jobField: "manufacturing",
  },
  {
    key: "machinery_operator",
    name: "Nhân viên vận hành máy móc",
    jobs: "production",
    jobField: "manufacturing",
  },
  {
    key: "maintenance_engineer",
    name: "Kỹ sư bảo trì",
    jobs: "production",
    jobField: "manufacturing",
  },
  {
    key: "inventory_manager",
    name: "Quản lý kho",
    jobs: "production",
    jobField: "manufacturing",
  },
  {
    key: "supply_chain_manager",
    name: "Quản lý chuỗi cung ứng",
    jobs: "production",
    jobField: "manufacturing",
  },

  // Education
  {
    key: "teacher",
    name: "Giáo viên",
    jobs: "education",
    jobField: "education",
  },
  {
    key: "trainer",
    name: "Giảng viên",
    jobs: "education",
    jobField: "education",
  },
  {
    key: "curriculum_developer",
    name: "Nhà phát triển chương trình giảng dạy",
    jobs: "education",
    jobField: "education",
  },
  {
    key: "education_advisor",
    name: "Cố vấn giáo dục",
    jobs: "education",
    jobField: "education",
  },
  {
    key: "school_principal",
    name: "Hiệu trưởng",
    jobs: "education",
    jobField: "education",
  },
  {
    key: "educational_technologist",
    name: "Chuyên gia công nghệ giáo dục",
    jobs: "education",
    jobField: "education",
  },
  {
    key: "education_coordinator",
    name: "Điều phối viên giáo dục",
    jobs: "education",
    jobField: "education",
  },
  {
    key: "special_education_teacher",
    name: "Giáo viên giáo dục đặc biệt",
    jobs: "education",
    jobField: "education",
  },

  // Retail / Life Services
  {
    key: "sales_associate",
    name: "Nhân viên bán hàng",
    jobs: "retail",
    jobField: "retail_life_services",
  },
  {
    key: "store_manager",
    name: "Quản lý cửa hàng",
    jobs: "retail",
    jobField: "retail_life_services",
  },
  {
    key: "cashier",
    name: "Thu ngân",
    jobs: "retail",
    jobField: "retail_life_services",
  },
  {
    key: "customer_service_representative",
    name: "Nhân viên chăm sóc khách hàng",
    jobs: "retail",
    jobField: "retail_life_services",
  },
  {
    key: "personal_shopper",
    name: "Tư vấn mua sắm cá nhân",
    jobs: "retail",
    jobField: "retail_life_services",
  },
  {
    key: "retail_analyst",
    name: "Chuyên viên phân tích bán lẻ",
    jobs: "retail",
    jobField: "retail_life_services",
  },
  {
    key: "marketing_specialist",
    name: "Chuyên viên marketing",
    jobs: "retail",
    jobField: "retail_life_services",
  },
  {
    key: "product_placement_specialist",
    name: "Chuyên gia trưng bày sản phẩm",
    jobs: "retail",
    jobField: "retail_life_services",
  },
]
