import db from "../models/index";

const checkEmail = async (email) => {
  const checkUser = await db.users.findOne({
    where: {
      email: email,
    },
  });
  return checkUser;
};

const calculateExperience = (data) => {
  if (!data) {
      return "no_experience";
  }
  let totalMonths = 0;
  for (const item of data) {
      // if (!item.startYear || !item.startMonth || !item.endYear || !item.endMonth ||
      //     typeof item.startYear !== 'number' || typeof item.startMonth !== 'number' ||
      //     typeof item.endYear !== 'number' || typeof item.endMonth !== 'number' ||
      //     item.startYear < 0 || item.startMonth < 1 || item.startMonth > 12 ||
      //     item.endYear < 0 || item.endMonth < 1 || item.endMonth > 12 ||
      //     item.startYear > item.endYear || (item.startYear === item.endYear && item.startMonth > item.endMonth)) {
      //     console.error("Dữ liệu đầu vào không hợp lệ:", item);
      //     continue; // Bỏ qua object không hợp lệ
      // }

      const months = (item.endYear - item.startYear) * 12 + (item.endMonth - item.startMonth);
      totalMonths += months;
  }
  let totalYears = Math.round(totalMonths / 12);
  switch (true) {
      case totalMonths < 12:
          return "under_1";
      case totalYears < 3:
          return "2_years";
      case totalYears < 4:
          return "3_years";
      case totalYears >= 4 && totalYears <= 5:
          return "4_5_years";
      default:
          return "above_5";
  }
}

module.exports = {
  checkEmail,
  calculateExperience
};
