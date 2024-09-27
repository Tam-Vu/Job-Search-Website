import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPass) => {
    let hashPassword = bcrypt.hashSync(userPass, salt);
    return hashPassword;
};

const checkPassword = (inputPass, hashPass) => {
    return bcrypt.compareSync(inputPass, hashPass);
};

module.exports = {
    hashUserPassword,
    checkPassword
}