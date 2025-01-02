import JobService from "../services/jobService";

class JobController {
  createJob = async (req, res) => {
    try {
      const {
        title,
        description,
        location,
        salaryRange,
        jobType,
        requirements,
        industry,
        jobField,
        professionalPosition,
        experience,
        closedDate
      } = req.body;
      if (
        !title ||
        !description ||
        !location ||
        !salaryRange ||
        !jobType ||
        !requirements ||
        !industry ||
        !jobField ||
        !professionalPosition ||
        !experience ||
        !closedDate
      ) {
        return res.status(200).json({
          EM: "Missing required fields",
          EC: "1",
          DT: "",
        });
      }
      const employerId = req.user.employerId;
      console.log(employerId);
      const response = await JobService.createJob(
        title,
        description,
        location,
        salaryRange,
        jobType,
        requirements,
        employerId,
        industry,
        jobField,
        professionalPosition,
        experience,
        closedDate
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  GetAllLegalJob = async (req, res) => {
    try {
      const response = await JobService.GetAllLegalJob();
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  GetJobById = async (req, res) => {
    try {
      const jobId = req.params.id;
      const userId = req.user.id;
      const response = await JobService.GetJobById(jobId, userId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  GetJobByEmployerId = async (req, res) => {
    try {
      const employerId = req.params.id;
      const response = await JobService.GetJobByEmployerId(employerId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  GetMyJobs = async (req, res) => {
    try {
      console.log(req.user.employerId);
      const response = await JobService.GetJobByEmployerId(req.user.employerId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  getRecommendedJobs = async (req, res) => {
    try {
      const userId = req.user.id;
      const response = await JobService.getRecommendedJobs(userId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
}
module.exports = new JobController();
