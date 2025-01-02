import db from "../models";
class userActivitiesService {
    AddUserActivity = async (userId, jobId, activityType) => {
        try {
            const check = await db.useractivities.findOne({
                where: {
                    userId,
                    jobId,
                }
            });
            if (check) {
                return;
            }
            await db.useractivities.create({
                userId,
                jobId,
                activityType
            });

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new userActivitiesService();