import type {CreateTaskPayload, ErrorWithContext, ITaskService, UpdateTaskPayload, WorkItem} from "./task.types";
import {WorkItemType} from "./task.constants";

export class TaskController {
    private _service: ITaskService;
    private _errors: ErrorWithContext[] = [];

    constructor(service: ITaskService) {
        this._service = service;
    }

    createTask(type: WorkItemType, payload: CreateTaskPayload): void {
        try {
            this._service.createTask(type, payload);
        } catch (error) {
            this._errors.push({entry: payload, error: error as Error});
        }
    }

    getTask(id: string): WorkItem | undefined {
        try {
            return this._service.getTask(id);
        } catch (error) {
            this._errors.push({ error: error as Error});
        }
    }

    getAllTasks(): WorkItem[] {
        return this._service.getAllTasks();
    }

    updateTask(id: string, updates: UpdateTaskPayload): void {
        try {

            this._service.updateTask(id, updates);
        } catch (error) {
            this._errors.push( {error: error as Error, entry: updates});
        }
    }

    addChildToTask(parentId: string, childId: string): void {
        try {
            this._service.addChildToTask(parentId, childId);
        } catch (error) {
            this._errors.push({ error: error as Error});
        }
    }

    removeChildFromTask(parentId: string, childId: string): void {
        try {
            this._service.removeChildFromTask(parentId, childId);
        } catch (error) {
            this._errors.push({ error: error as Error});
        }
    }

    removeTask(id: string): void {
        try {
            this._service.removeTask(id);
        } catch (error) {
            this._errors.push({ error: error as Error});
        }
    }

    getErrors(): ErrorWithContext[] {
        return this._errors;
    }

    printErrors(): void {
        this._errors.forEach(({entry, error}, index) => {
            console.error(`Error ${index + 1}: ${error.message}`);
            if (entry) {
                console.error(`  Entry: ${JSON.stringify(entry)}`);
                console.log('');
            }
        })
    }
}
