import db from "../models/index";

const checkEmail = async (email) => {
  const checkUser = await db.users.findOne({
    where: {
      email: email,
    },
  });
  return checkUser;
};

module.exports = {
  checkEmail,
};
