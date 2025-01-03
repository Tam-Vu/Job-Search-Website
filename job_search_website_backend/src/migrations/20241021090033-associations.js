"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("employees", {
      fields: ["userId"],
      type: "foreign key",
      references: {
        table: "users",
        field: "id",
      },
      name: "FK_01",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("employers", {
      fields: ["userId"],
      type: "foreign key",
      references: {
        table: "users",
        field: "id",
      },
      name: "FK_02",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("userActivities", {
      fields: ["userId"],
      type: "foreign key",
      references: {
        table: "users",
        field: "id",
      },
      name: "FK_03",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("jobs", {
      fields: ["employerId"],
      type: "foreign key",
      references: {
        table: "employers",
        field: "id",
      },
      name: "FK_04",
      onDelete: "CASCADE",
    });

    // await queryInterface.addConstraint('jobs', {
    //   fields: ['industryId'],
    //   type: 'foreign key',
    //   references: {
    //     table: 'industries',
    //     field: 'id',
    //   },
    //   name: 'FK_05',
    //   onDelete: 'CASCADE',
    // });

    await queryInterface.addConstraint("userActivities", {
      fields: ["jobId"],
      type: "foreign key",
      references: {
        table: "jobs",
        field: "id",
      },
      name: "FK_06",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("resumes", {
      fields: ["employeeId"],
      type: "foreign key",
      references: {
        table: "employees",
        field: "id",
      },
      name: "FK_07",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("resumeSkills", {
      fields: ["resumeId"],
      type: "foreign key",
      references: {
        table: "resumes",
        field: "id",
      },
      name: "FK_08",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("resumeSkills", {
      fields: ["skillId"],
      type: "foreign key",
      references: {
        table: "skills",
        field: "id",
      },
      name: "FK_09",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("experienceDetails", {
      fields: ["resumeId"],
      type: "foreign key",
      references: {
        table: "resumes",
        field: "id",
      },
      name: "FK_10",
      onDelete: "CASCADE",
    });
    // await queryInterface.addConstraint("interviewschedules", {
    //   fields: ["resumeId"],
    //   type: "foreign key",
    //   references: {
    //     table: "resumes",
    //     field: "id",
    //   },
    //   name: "FK_11",
    //   onDelete: "CASCADE",
    // });

    await queryInterface.addConstraint("interviewschedules", {
      fields: ["applicationId"],
      type: "foreign key",
      references: {
        table: "applications",
        field: "id",
      },
      name: "FK_12",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("applications", {
      fields: ["jobId"],
      type: "foreign key",
      references: {
        table: "jobs",
        field: "id",
      },
      name: "FK_13",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("applications", {
      fields: ["resumeId"],
      type: "foreign key",
      references: {
        table: "resumes",
        field: "id",
      },
      name: "FK_14",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("educations", {
      fields: ["resumeId"],
      type: "foreign key",
      references: {
        table: "resumes",
        field: "id",
      },
      name: "FK_15",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("notifications", {
      fields: ["jobId"],
      type: "foreign key",
      references: {
        table: "jobs",
        field: "id",
      },
      name: "FK_16",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("notifications", {
      fields: ["employeeId"],
      type: "foreign key",
      references: {
        table: "employees",
        field: "id",
      },
      name: "FK_17",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint("employees", "FK_01");
    await queryInterface.removeConstraint("employers", "FK_02");
    await queryInterface.removeConstraint("userActivities", "FK_03");
    await queryInterface.removeConstraint("jobs", "FK_04");
    // await queryInterface.removeConstraint('jobs', 'FK_05');
    await queryInterface.removeConstraint("userActivities", "FK_06");
    await queryInterface.removeConstraint("resumes", "FK_07");
    await queryInterface.removeConstraint("resumeSkills", "FK_08");
    await queryInterface.removeConstraint("resumeSkills", "FK_09");
    await queryInterface.removeConstraint("experienceDetails", "FK_10");
    // await queryInterface.removeConstraint("interviewschedules", "FK_11");
    await queryInterface.removeConstraint("interviewschedules", "FK_12");
    await queryInterface.removeConstraint("applications", "FK_13");
    await queryInterface.removeConstraint("applications", "FK_14");
    await queryInterface.removeConstraint("educations", "FK_15");
    await queryInterface.removeConstraint("notifications", "FK_16");
    await queryInterface.removeConstraint("notifications", "FK_17");
  },
};
