import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { useUpdateIssue, useDeleteIssue } from "../hooks/useIssues";
import { useGetWorkspaceMembers } from "../hooks/useWorkspace";
import useWorkspaceStore from "../store/workspaceStore";
import { IssueDetailSkeleton } from "../components/Skeleton";
import StatusIcon from "../components/StatusIcon";
import PriorityIcon from "../components/PriorityIcon";
import Dropdown from "../components/Dropdown";

const statusOptions = ["backlog", "todo", "in-progress", "done", "cancelled"];
const priorityOptions = ["no-priority", "urgent", "high", "medium", "low"];

const statusStyles = {
  backlog: { color: "text-[#8a8a8a]", label: "Backlog" },
  todo: { color: "text-[#5e5ce6]", label: "Todo" },
  "in-progress": { color: "text-[#f5a623]", label: "In Progress" },
  done: { color: "text-[#4caf50]", label: "Done" },
  cancelled: { color: "text-[#8a8a8a]", label: "Cancelled" },
};

const priorityStyles = {
  "no-priority": { color: "text-[#8a8a8a]", label: "No Priority" },
  urgent: { color: "text-[#f44336]", label: "Urgent" },
  high: { color: "text-[#f5a623]", label: "High" },
  medium: { color: "text-[#5e5ce6]", label: "Medium" },
  low: { color: "text-[#4caf50]", label: "Low" },
};

function IssuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const workspaceId = useWorkspaceStore((state) => state.currentWorkspace?._id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const { mutate: updateIssue } = useUpdateIssue();
  const { mutate: deleteIssue } = useDeleteIssue();
  const { data: members } = useGetWorkspaceMembers();

  const {
    data: issue,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["issue", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/workspaces/${workspaceId}/issues/${id}`,
      );
      return data;
    },
    enabled: !!workspaceId && !!id,
  });

  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description || "");
    }
  }, [issue]);

  const handleTitleSave = () => {
    if (!title.trim() || title === issue.title) {
      setTitle(issue.title);
      setIsEditingTitle(false);
      return;
    }
    updateIssue({ id, title });
    setIsEditingTitle(false);
  };

  const handleDescriptionSave = () => {
    if (description === issue.description) {
      setIsEditingDescription(false);
      return;
    }
    updateIssue({ id, description });
    setIsEditingDescription(false);
  };

  const handleDelete = () => {
    deleteIssue(id, {
      onSuccess: () => navigate("/issues"),
    });
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#2e2e2e]">
          <div className="w-24 h-3 bg-[#242424] rounded animate-pulse" />
          <div className="w-20 h-3 bg-[#242424] rounded animate-pulse" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <IssueDetailSkeleton />
        </div>
      </div>
    );
  }

  if (isError || !issue) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-400 text-sm">Failed to load issue</p>
      </div>
    );
  }

  const status = statusStyles[issue.status] || statusStyles.todo;
  const priority =
    priorityStyles[issue.priority] || priorityStyles["no-priority"];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#2e2e2e]">
        <button
          onClick={() => navigate("/issues")}
          className="text-[#8a8a8a] hover:text-white text-sm transition-colors"
        >
          Back to Issues
        </button>
        <button
          onClick={handleDelete}
          className="text-[#8a8a8a] hover:text-red-400 text-sm transition-colors"
        >
          Delete issue
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Title */}
          <div className="mb-6">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSave();
                  if (e.key === "Escape") {
                    setTitle(issue.title);
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                className="w-full bg-transparent text-white text-2xl font-semibold outline-none border-b border-[#5e5ce6] pb-1"
              />
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                className="text-white text-2xl font-semibold cursor-pointer hover:text-[#c0c0c0] transition-colors"
                title="Click to edit"
              >
                {issue.title}
              </h1>
            )}
          </div>

          {/* Identifier */}
          <p className="text-xs text-[#4a4a4a] font-mono mb-6 -mt-4">
            {issue.identifier}
          </p>

          {/* Properties */}
          <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-4 mb-6 space-y-1">
            {/* Status */}
            <div className="flex items-center gap-4 py-1">
              <span className="text-xs text-[#8a8a8a] w-24 flex-shrink-0">
                Status
              </span>
              <Dropdown
                value={issue.status}
                options={statusOptions.map((s) => ({
                  value: s,
                  label: statusStyles[s].label,
                  icon: <StatusIcon status={s} size={12} />,
                }))}
                onChange={(value) => updateIssue({ id, status: value })}
                trigger={
                  <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#242424] transition-colors">
                    <StatusIcon status={issue.status} size={12} />
                    <span className={`text-sm font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                }
              />
            </div>

            {/* Priority */}
            <div className="flex items-center gap-4 py-1">
              <span className="text-xs text-[#8a8a8a] w-24 flex-shrink-0">
                Priority
              </span>
              <Dropdown
                value={issue.priority}
                options={priorityOptions.map((p) => ({
                  value: p,
                  label: priorityStyles[p].label,
                  icon: <PriorityIcon priority={p} size={12} />,
                }))}
                onChange={(value) => updateIssue({ id, priority: value })}
                trigger={
                  <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#242424] transition-colors">
                    <PriorityIcon priority={issue.priority} size={12} />
                    <span className={`text-sm font-medium ${priority.color}`}>
                      {priority.label}
                    </span>
                  </div>
                }
              />
            </div>
            {/* Due date */}
            <div className="flex items-center gap-4 py-1">
              <span className="text-xs text-[#8a8a8a] w-24 flex-shrink-0">
                Due date
              </span>
              <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#242424] transition-colors">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect
                    x="1"
                    y="2"
                    width="10"
                    height="9"
                    rx="1"
                    stroke="#8a8a8a"
                    strokeWidth="1.2"
                  />
                  <path d="M1 5h10" stroke="#8a8a8a" strokeWidth="1.2" />
                  <path
                    d="M4 1v2M8 1v2"
                    stroke="#8a8a8a"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="date"
                  value={
                    issue.dueDate
                      ? new Date(issue.dueDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    updateIssue({ id, dueDate: e.target.value || null })
                  }
                  className="bg-transparent text-xs text-[#8a8a8a] outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Assignee */}
            <div className="flex items-center gap-4 py-1">
              <span className="text-xs text-[#8a8a8a] w-24 flex-shrink-0">
                Assignee
              </span>
              <Dropdown
                value={issue.assignee?._id || ""}
                options={[
                  { value: "", label: "Unassigned" },
                  ...(members?.map((m) => ({
                    value: m.user._id,
                    label: m.user.name,
                  })) || []),
                ]}
                onChange={(value) =>
                  updateIssue({ id, assignee: value || null })
                }
                trigger={
                  <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#242424] transition-colors">
                    {issue.assignee ? (
                      <>
                        <div className="w-4 h-4 rounded-full bg-[#5e5ce6] flex items-center justify-center">
                          <span className="text-white text-[9px] font-medium">
                            {issue.assignee.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-white">
                          {issue.assignee.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-[#8a8a8a]">Unassigned</span>
                    )}
                  </div>
                }
              />
            </div>

            {/* Created by */}
            <div className="flex items-center gap-4 py-1">
              <span className="text-xs text-[#8a8a8a] w-24 flex-shrink-0">
                Created by
              </span>
              <div className="flex items-center gap-2 px-2 py-1">
                <div className="w-4 h-4 rounded-full bg-[#5e5ce6] flex items-center justify-center">
                  <span className="text-white text-[9px] font-medium">
                    {issue.createdBy?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-white">
                  {issue.createdBy?.name}
                </span>
              </div>
            </div>

            {/* Created at */}
            <div className="flex items-center gap-4 py-1">
              <span className="text-xs text-[#8a8a8a] w-24 flex-shrink-0">
                Created
              </span>
              <span className="text-sm text-[#8a8a8a] px-2 py-1">
                {new Date(issue.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs text-[#8a8a8a] mb-2">Description</p>
            {isEditingDescription ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionSave}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setDescription(issue.description || "");
                    setIsEditingDescription(false);
                  }
                }}
                autoFocus
                rows={6}
                placeholder="Add a description..."
                className="w-full bg-[#1a1a1a] border border-[#5e5ce6] text-white text-sm rounded px-3 py-2 outline-none placeholder-[#4a4a4a] resize-none transition-colors"
              />
            ) : (
              <div
                onClick={() => setIsEditingDescription(true)}
                className="min-h-24 p-2 rounded text-sm text-[#8a8a8a] cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                title="Click to edit"
              >
                {issue.description || "Add a description..."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssuePage;
