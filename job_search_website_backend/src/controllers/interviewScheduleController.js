import InterviewScheduleService from "../services/interviewScheduleService";
class InterviewScheduleController {
  createInterviewShedule = async (req, res) => {
    try {
      const { location, date, time } = req.body;
      const applicationId = req.params.applicationId;
      if ( !location || !date || !time) {
        return res.status(200).json({
          EM: "Missing required fields",
          EC: "1",
          DT: "",
        });
      }
      const response = await InterviewScheduleService.createInterviewShedule(
        applicationId,
        location,
        date,
        time,
      );
      
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  updateInterviewSchedule = async (req, res) => {
    try {
      const { location, date, time } = req.body;
      const interviewScheduleId = req.params.interviewScheduleId;
      if ( !location || date || !time) {
        return res.status(200).json({
          EM: "Missing required fields",
          EC: "1",
          DT: "",
        });
      }
      const response = InterviewScheduleService.updateInterviewShedule(
        interviewScheduleId,
        location,
        date,
        time,
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  completeInterviewShedule = async (req, res) => {
    try {
      const interviewScheduleId = req.params.interviewScheduleId;
      const response = await InterviewScheduleService.completeInterviewShedule(
        interviewScheduleId,
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  cancelInterviewShedule = async (req, res) => {
    try {
      const interviewScheduleId = req.params.interviewScheduleId;
      const response = await InterviewScheduleService.cancelInterviewShedule(
        interviewScheduleId,
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
}
module.exports = new InterviewScheduleController();
