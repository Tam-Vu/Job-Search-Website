import loginAndRegisterService from "../services/loginAndRegisterService";

class LoginAndRegisterController {
    registerUser = async (req, res) => {
        try {
            let { email, password, fullname, role } = req.body;
            if (!email || !password || !fullname || !role) {
                return res.status(200).json({
                    EM: 'Missing required fields',
                    EC: '1',
                    DT: ''
                });
            }
            const response = await loginAndRegisterService.registerUser(email, password, fullname, role);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    registerEmployer = async (req, res) => {
        try {
            let { companyName, companyDescription, location, website, fullName, email, password, confirmPassword } = req.body;
            if (!companyName || !companyDescription || !location || !website || !fullName || !email || !password || !confirmPassword) {
                return res.status(200).json({
                    EM: 'Missing required fields',
                    EC: '1',
                    DT: ''
                });
            }
            const response = await loginAndRegisterService.registerEmployer(companyName, companyDescription, location, website, fullName, email, password, confirmPassword);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    login = async (req, res) => {
        try {
            let { email, password } = req.body;
            if (!email || !password) {
                return res.status(200).json({
                    EM: 'Missing required fields',
                    EC: '1',
                    DT: ''
                });
            }
            const response = await loginAndRegisterService.login(email, password);
            if (response.DT && response) {
                res.cookie("jwt", response.DT, { httpOnly: true, maxAge: 60 * 60 * 1000 * 24 * 7 })
            }
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new LoginAndRegisterController();