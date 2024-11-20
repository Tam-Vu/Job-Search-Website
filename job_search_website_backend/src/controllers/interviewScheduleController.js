import InterviewScheduleService from "../services/interviewScheduleService";
class InterviewScheduleController {
  createInterviewShedule = async (req, res) => {
    try {
      const { resumeId, jobId, location, date, time } = req.body;
      if (!resumeId || !jobId || !location || date || !time) {
        return res.status(200).json({
          EM: "Missing required fields",
          EC: "1",
          DT: "",
        });
      }
      const response = InterviewScheduleService.createInterviewShedule(
        resumeId,
        jobId,
        location,
        date,
        time,
      );
      return req.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  updateInterviewSchedule = async (req, res) => {};
}
module.exports = new InterviewScheduleController();
