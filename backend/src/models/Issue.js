import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['backlog', 'todo', 'in-progress', 'done', 'cancelled'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['no-priority', 'urgent', 'high', 'medium', 'low'],
      default: 'no-priority',
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;