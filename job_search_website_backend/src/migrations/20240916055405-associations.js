'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('resumes', {
      fields: ['userId'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.addConstraint('conversations', {
      fields: ['senderId'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.addConstraint('conversations', {
      fields: ['receiverId'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.addConstraint('employers', {
      fields: ['userId'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.addConstraint('useractivities', {
      fields: ['userId'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.addConstraint('messages', {
      fields: ['conversationId'],
      type: 'foreign key',
      references: {
        table: 'conversations',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.addConstraint('interviewschedules', {
      fields: ['resumeId'],
      type: 'foreign key',
      references: {
        table: 'resumes',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.addConstraint('applications', {
      fields: ['resumeId'],
      type: 'foreign key',
      references: {
        table: 'resumes',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.addConstraint('interviewschedules', {
      fields: ['jobId'],
      type: 'foreign key',
      references: {
        table: 'jobs',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.addConstraint('applications', {
      fields: ['jobId'],
      type: 'foreign key',
      references: {
        table: 'jobs',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.addConstraint('jobs', {
      fields: ['employerId'],
      type: 'foreign key',
      references: {
        table: 'employers',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.addConstraint('useractivities', {
      fields: ['jobId'],
      type: 'foreign key',
      references: {
        table: 'jobs',
        field: 'id'
      },
      onDelete: 'cascade'
    })
  },

  //=======================================================================
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('resumes', {
      fields: ['userId'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.removeConstraint('conversations', {
      fields: ['senderId'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.removeConstraint('conversations', {
      fields: ['receiverId'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.removeConstraint('employers', {
      fields: ['userId'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.removeConstraint('useractivities', {
      fields: ['userId'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.removeConstraint('messages', {
      fields: ['conversationId'],
      type: 'foreign key',
      references: {
        table: 'conversations',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.removeConstraint('interviewschedules', {
      fields: ['resumeId'],
      type: 'foreign key',
      references: {
        table: 'resumes',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.removeConstraint('applications', {
      fields: ['resumeId'],
      type: 'foreign key',
      references: {
        table: 'resumes',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.removeConstraint('interviewschedules', {
      fields: ['jobId'],
      type: 'foreign key',
      references: {
        table: 'jobs',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.removeConstraint('applications', {
      fields: ['jobId'],
      type: 'foreign key',
      references: {
        table: 'jobs',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.removeConstraint('jobs', {
      fields: ['employerId'],
      type: 'foreign key',
      references: {
        table: 'employers',
        field: 'id'
      },
      onDelete: 'cascade'
    })

    await queryInterface.removeConstraint('useractivities', {
      fields: ['jobId'],
      type: 'foreign key',
      references: {
        table: 'jobs',
        field: 'id'
      },
      onDelete: 'cascade'
    })
  },
}
