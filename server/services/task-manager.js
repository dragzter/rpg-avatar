// TaskManager.js

class TaskManager {
    constructor() {
        this.activeTasks = {};
    }

    // Add a new task
    addTask(taskId) {
        this.activeTasks[taskId] = {canceled: false};
    }

    // Cancel a task
    cancelTask(taskId) {
        if (this.activeTasks[taskId]) {
            this.activeTasks[taskId].canceled = true;
        }
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
