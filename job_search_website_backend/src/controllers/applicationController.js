import applicationService from "../services/applicationService";

class ApplicationController {
  createApplication = async (req, res) => {
    try {
      const jobId = req.params.jobId;
      const { resumeId } = req.body;
      if (!jobId || !resumeId) {
        return res.status(200).json({
          EM: "Missing required fields",
          EC: "1",
          DT: "",
        });
      }
      const response = await applicationService.createApplication(
        jobId,
        resumeId,
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  getAllMyApplications = async (req, res) => {
    try {
      const employeeId = req.user.employeeId;
      const response = await applicationService.getAllMyApplications(employeeId);
      return res.status(200).json(response);
    }
    catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  getApplicationsByJobId = async (req, res) => {
    try {
      const jobId = req.params.jobId;
      const response = await applicationService.getApplicationsByJobId(jobId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  approveApplication = async (req, res) => {
    try {
      const applicationId = req.params.applicationId;
      const response = await applicationService.approveApplication(applicationId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  rejectApplication = async (req, res) => {
    try {
      const applicationId = req.params.applicationId;
      const response = await applicationService.rejectApplication(applicationId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  getAllAcceptedApplicationsByJobId = async (req, res) => {
    try {
      const jobId = req.params.jobId;
      const response = await applicationService.getAllAcceptedApplicationsByJobId(jobId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };  
}
module.exports = new ApplicationController();
