// TaskManager.js
export const ApiTaskStatus = {
    PENDING: "pending",
    COMPLETE: "complete",
    FAILED: "failed",
    CANCELED: "canceled",
    TIMEOUT: "timeout",
};

class TaskManager {
    // task status can be "pending", "complete", "failed", "cancelled"
    constructor() {
        this.activeTasks = {};
    }

    // Add a new task
    addTask(taskId) {
        this.activeTasks[taskId] = {canceled: false, status: ApiTaskStatus.PENDING};
    }

    // Cancel a task
    cancelTask(taskId) {
        if (this.activeTasks[taskId]) {
            this.activeTasks[taskId] = {
                canceled: true,
                status: ApiTaskStatus.CANCELED,
            };
        }
    }

    getTaskStatus(taskId) {
        return this.activeTasks[taskId];
    }

    // Check if a task is canceled
    isTaskCanceled(taskId) {
        return this.activeTasks[taskId]?.canceled || false;
    }

    // Remove a task after completion or cancellation
    removeTask(taskId) {
        delete this.activeTasks[taskId];
    }
}

const taskManager = new TaskManager();

export default taskManager
