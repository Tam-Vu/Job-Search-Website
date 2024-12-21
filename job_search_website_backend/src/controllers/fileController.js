import fileService from '../services/fileService';
class fileController {
    uploadFile = async (req, res) => {
        try {
            const result = await fileService.uploadFile(req.file);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json(error);
        }
    }
}
module.exports = new fileController();