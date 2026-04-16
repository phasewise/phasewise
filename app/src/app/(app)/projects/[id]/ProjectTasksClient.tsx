"use client";

import { useMemo, useState } from "react";

type User = {
  id: string;
  fullName: string;
};

type Assignment = {
  userId: string;
  user: User;
};

type Task = {
  id: string;
  name: string;
  description: string | null;
  dueDate: Date | string | null;
  status: string;
  assignedToId: string | null;
  assignedTo: User | null;
};

type Props = {
  projectId: string;
  currentUserRole: string;
  users: User[];
  assignments: Assignment[];
  tasks: Task[];
};

const rolesAllowedToManage = ["OWNER", "ADMIN", "PM", "SUPERVISOR"];

const taskStatuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETE"] as const;

export default function ProjectTasksClient({ projectId, currentUserRole, users, assignments, tasks }: Props) {
  const [projectAssignments, setProjectAssignments] = useState(assignments);
  const [taskList, setTaskList] = useState(tasks);
  const [selectedAssignee, setSelectedAssignee] = useState(users[0]?.id ?? "");
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState(users[0]?.id ?? "");
  const [savingTask, setSavingTask] = useState(false);
  const [savingAssignment, setSavingAssignment] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editAssignee, setEditAssignee] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  function openEdit(task: Task) {
    setEditingTask(task);
    setEditName(task.name);
    setEditDescription(task.description ?? "");
    setEditDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
    );
    setEditAssignee(task.assignedToId ?? "");
    setEditStatus(task.status);
    setError(null);
  }

  function closeEdit() {
    setEditingTask(null);
  }

  async function saveEdit() {
    if (!editingTask) return;
    if (!editName.trim()) {
      setError("Task name is required.");
      return;
    }
    setEditSaving(true);
    setError(null);
    const res = await fetch(`/api/projects/${projectId}/tasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: editingTask.id,
        name: editName.trim(),
        description: editDescription.trim() || null,
        dueDate: editDueDate || null,
        assignedToId: editAssignee || null,
        status: editStatus,
      }),
    });
    const result = await res.json();
    setEditSaving(false);
    if (!res.ok) {
      setError(result.error || "Unable to update task.");
      return;
    }
    setTaskList((current) =>
      current.map((t) => (t.id === editingTask.id ? result.task : t))
    );
    closeEdit();
  }

  async function deleteTask() {
    if (!editingTask) return;
    if (!confirm(`Delete task "${editingTask.name}"? This can't be undone.`)) return;
    setEditSaving(true);
    const res = await fetch(
      `/api/projects/${projectId}/tasks?taskId=${editingTask.id}`,
      { method: "DELETE" }
    );
    setEditSaving(false);
    if (!res.ok) {
      const result = await res.json().catch(() => ({}));
      setError(result.error || "Unable to delete task.");
      return;
    }
    setTaskList((current) => current.filter((t) => t.id !== editingTask.id));
    closeEdit();
  }

  const canManage = rolesAllowedToManage.includes(currentUserRole);

  const assignmentOptions = useMemo(
    () => users.filter((user) => !projectAssignments.some((assignment) => assignment.userId === user.id)),
    [users, projectAssignments]
  );

  async function assignUser(userId: string) {
    setError(null);
    setSavingAssignment(userId);

    const response = await fetch(`/api/projects/${projectId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: "assign" }),
    });

    const result = await response.json();
    setSavingAssignment(null);

    if (!response.ok) {
      setError(result.error || "Unable to assign user.");
      return;
    }

    setProjectAssignments((current) => [...current, { userId, user: users.find((user) => user.id === userId)! }]);
  }

  async function removeAssignment(userId: string) {
    setError(null);
    setSavingAssignment(userId);

    const response = await fetch(`/api/projects/${projectId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: "remove" }),
    });

    const result = await response.json();
    setSavingAssignment(null);

    if (!response.ok) {
      setError(result.error || "Unable to remove assignment.");
      return;
    }

    setProjectAssignments((current) => current.filter((assignment) => assignment.userId !== userId));
  }

  async function createTask() {
    if (!newTaskName.trim()) {
      setError("Task name is required.");
      return;
    }

    setError(null);
    setSavingTask(true);

    const response = await fetch(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newTaskName.trim(),
        description: newTaskDescription.trim() || undefined,
        dueDate: newTaskDueDate || undefined,
        assignedToId: newTaskAssignee || undefined,
      }),
    });

    const result = await response.json();
    setSavingTask(false);

    if (!response.ok) {
      setError(result.error || "Unable to create task.");
      return;
    }

    setTaskList((current) => [...current, result.task]);
    setNewTaskName("");
    setNewTaskDescription("");
    setNewTaskDueDate("");
    setNewTaskAssignee(users[0]?.id ?? "");
  }

  async function updateTask(taskId: string, update: Record<string, any>) {
    setError(null);

    const response = await fetch(`/api/projects/${projectId}/tasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, ...update }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Unable to update task.");
      return;
    }

    setTaskList((current) => current.map((task) => (task.id === taskId ? result.task : task)));
  }

  return (
    <div className="space-y-6">
      {error ? <p className="rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Project tasks</h2>
              <p className="mt-1 text-sm text-slate-500">Track deadlines, assignments, and completion status for this project.</p>
            </div>
            <span className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600">{taskList.length} tasks</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Task</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {taskList.map((task) => (
                  <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => canManage && openEdit(task)}
                        disabled={!canManage}
                        className="text-left font-semibold text-slate-900 hover:text-[#2D6A4F] disabled:hover:text-slate-900 disabled:cursor-default transition-colors"
                      >
                        {task.name}
                      </button>
                      {task.description ? <div className="text-xs text-slate-500 mt-1">{task.description}</div> : null}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {task.assignedTo?.fullName ?? "Unassigned"}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-4 text-slate-600">
                      <select
                        value={task.status}
                        onChange={(event) => updateTask(task.id, { status: event.target.value })}
                        disabled={!canManage && task.assignedToId !== undefined}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500"
                      >
                        {taskStatuses.map((statusOption) => (
                          <option key={statusOption} value={statusOption}>{statusOption.replace(/_/g, " ")}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => updateTask(task.id, { status: task.status === "COMPLETE" ? "IN_PROGRESS" : "COMPLETE" })}
                        className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        {task.status === "COMPLETE" ? "Reopen" : "Complete"}
                      </button>
                    </td>
                  </tr>
                ))}
                {taskList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">No tasks added yet.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">New task</h3>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Name</label>
                <input
                  value={newTaskName}
                  onChange={(event) => setNewTaskName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={newTaskDescription}
                  onChange={(event) => setNewTaskDescription(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Due date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(event) => setNewTaskDueDate(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Assign to</label>
                <select
                  value={newTaskAssignee}
                  onChange={(event) => setNewTaskAssignee(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.fullName}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={createTask}
                disabled={savingTask}
                className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
              >
                {savingTask ? "Creating..." : "Create task"}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Assigned team</h3>
                <p className="mt-1 text-sm text-slate-500">Project members with task assignments.</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {projectAssignments.map((assignment) => (
                <div key={assignment.userId} className="rounded-2xl bg-slate-50 px-4 py-3 flex items-center justify-between gap-4">
                  <div className="text-sm text-slate-700">{assignment.user.fullName}</div>
                  {canManage ? (
                    <button
                      type="button"
                      onClick={() => removeAssignment(assignment.userId)}
                      disabled={savingAssignment === assignment.userId}
                      className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-rose-400 disabled:opacity-60"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
              {projectAssignments.length === 0 ? (
                <p className="text-sm text-slate-500">No team members assigned yet.</p>
              ) : null}
            </div>

            {canManage ? (
              <div className="mt-6 space-y-3">
                <label className="block text-sm font-medium text-slate-700">Add team member</label>
                <div className="flex gap-3">
                  <select
                    value={selectedAssignee}
                    onChange={(event) => setSelectedAssignee(event.target.value)}
                    className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  >
                    <option value="">Select a team member</option>
                    {assignmentOptions.map((user) => (
                      <option key={user.id} value={user.id}>{user.fullName}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => assignUser(selectedAssignee)}
                    disabled={!selectedAssignee || savingAssignment === selectedAssignee}
                    className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {editingTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={closeEdit}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-[#E2EBE4]">
              <h3 className="text-lg font-semibold text-[#1A2E22]">Edit task</h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-[#3D5C48]">Name</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#3D5C48]">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white resize-y"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-[#3D5C48]">Due date</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#3D5C48]">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                  >
                    {taskStatuses.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#3D5C48]">Assignee</label>
                <select
                  value={editAssignee}
                  onChange={(e) => setEditAssignee(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.fullName}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#E2EBE4] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={deleteTask}
                disabled={editSaving}
                className="text-sm font-medium text-rose-500 hover:text-rose-700 transition-colors disabled:opacity-60"
              >
                Delete task
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={closeEdit}
                  disabled={editSaving}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[#6B8C74] hover:text-[#1A2E22] transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={editSaving}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors disabled:opacity-60"
                >
                  {editSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
