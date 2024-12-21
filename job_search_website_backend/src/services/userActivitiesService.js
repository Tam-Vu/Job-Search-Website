
class userActivitiesService {
    AddUserActivity = async (userId, jobId) => {
        try {
            await db.userActivities.create({
                userId,
                jobId,
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new userActivitiesService();