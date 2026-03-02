import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'created',
        'status_changed',
        'priority_changed',
        'assignee_changed',
        'title_changed',
        'description_changed',
        'due_date_changed',
      ],
      required: true,
    },
    from: {
      type: String,
      default: null,
    },
    to: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;