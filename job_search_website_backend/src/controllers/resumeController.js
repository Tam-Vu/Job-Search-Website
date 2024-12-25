import resumeService from "../services/resumeService";

class ResumeController {
  createResume = async (req, res) => {
    try {
      let { name, field } = req.body;
      if (!name) {
        return res.status(200).json({
          EM: "Missing required fields",
          EC: "1",
          DT: "",
        });
      }
      let employeeId = req.user.employeeId;
      let response = await resumeService.createResume(
        name,
        employeeId,
        field
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  detailsResume = async (req, res) => {
    try {
      let resumeId = req.params.resumeId;
      let response = await resumeService.detailsResume(resumeId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  updateResume = async (req, res) => {
    try {
      let resumeId = req.params.resumeId;
      let { name, description, skills, experienceDetails, educations } = req.body;
      let response = await resumeService.updateResume(
        resumeId,
        name,
        description,
        skills,
        experienceDetails,
        educations,
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  deleteResume = async (req, res) => {
    try {
      let resumeId = req.params.resumeId;
      let response = await resumeService.deleteResume(resumeId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  getAllMyResume = async (req, res) => {
    try {
      let employeeId = req.user.employeeId;
      let response = await resumeService.getAllMyResume(employeeId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ResumeController();
