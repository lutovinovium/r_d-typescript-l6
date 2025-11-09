import 'reflect-metadata';
import {WorkItemType} from "./task.constants";
import type {CreateTaskPayload, ITaskService, UpdateTaskPayload, WorkItem} from "./task.types";
import {Epic} from "./models/Epic.model";
import {Story} from "./models/Story.model";
import {Task} from "./models/Task.model";
import {Subtask} from "./models/Subtask.model";
import {Bug} from "./models/Bug.model";

export class TaskService implements ITaskService {
    private _tasks: WorkItem[] = [];

    // Create
    createTask(type: WorkItemType, payload: CreateTaskPayload): void {
        if (this.getTask(payload.id)) {
            throw new Error(`Task with id ${payload.id} already exists`);
        }
        switch (type) {
            case WorkItemType.EPIC:
                this._tasks.push(new Epic(payload));
                break;
            case WorkItemType.STORY:
                this._tasks.push(new Story(payload));
                break;
            case WorkItemType.TASK:
                this._tasks.push(new Task(payload));
                break;
            case WorkItemType.SUBTASK:
                this._tasks.push(new Subtask(payload));
                break;
            case WorkItemType.BUG:
                this._tasks.push(new Bug(payload));
                break;
            default:
                throw new Error(`Unknown work item type: ${type}`);
        }
    }

    // Read
    getTask(id: string): WorkItem | undefined {
        return this._tasks.find(task => task.id === id);
    }

    getAllTasks(): WorkItem[] {
        return this._tasks;
    }

    // Update
    updateTask(id: string, updates: UpdateTaskPayload): void {
        const task = this.getTask(id);
        if (!task) {
            throw new Error(`Task with id ${id} not found`);
        }
        task.updateDetails(updates);
    }

    addChildToTask(parentId: string, childId: string): void {
        const parentTask = this.getTask(parentId);
        const childTask = this.getTask(childId);
        if (!parentTask) {
            throw new Error(`Parent task with id ${parentId} not found`);
        }
        if (!childTask) {
            throw new Error(`Child task with id ${childId} not found`);
        }
        if (!('children' in parentTask)) {
            throw new Error(`Task with id ${parentId} cannot have children`);
        }
        parentTask.addChild(childId);
    }

    removeChildFromTask(parentId: string, childId: string): void {
        const parentTask = this.getTask(parentId);
        if (!parentTask) {
            throw new Error(`Parent task with id ${parentId} not found`)
        }
        if (!('children' in parentTask)) {
            throw new Error(`Task with id ${parentId} cannot have children`);
        }
        if (!parentTask.children.includes(childId)) {
            throw new Error(`Child task with id ${childId} not found in parent task ${parentId}`);
        }
        parentTask.removeChild(childId)
    }

    // Delete
    removeTask(id: string): void {
        this._tasks = this._tasks.filter(task => task.id !== id);
    }
}
