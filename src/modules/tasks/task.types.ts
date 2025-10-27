import {Priority, Status, WorkItemType} from "./task.constants";
import {Bug, Epic, Story, Subtask, Task} from "./task.models";

export type ITaskBase = {
    id: string;
    title: string;
    type: WorkItemType;
    createdAt: Date;
    status: Status;
    priority: Priority;
    description?: string;
    deadline?: Date;
    doneAt?: Date;
}

export type WithChildren = {
    children: string[];
}

export type TaskBaseSerialised = {
    id: string;
    type: WorkItemType;
    title: string;
    createdAt: string;
    status: Status;
    priority: Priority;
    description?: string;
    deadline?: string;
    doneAt?: string;
}

export type CreateTaskPayload = {
    id: string;
    title: string;
    createdAt?: Date | string;
    status?: string;
    priority?: string;
    description?: string;
    deadline?: Date | string;
    doneAt?: Date | string;
}
export type ErrorWithContext = { entry?: unknown, error: Error };
export type UpdateTaskPayload = Partial<Omit<CreateTaskPayload, 'id' | 'createdAt'>>;
export type WorkItem = Epic | Story | Task | Subtask | Bug;

export type ITaskService = {
    createTask(type: WorkItemType, payload: CreateTaskPayload): void;

    getTask(id: string): WorkItem | undefined;

    getAllTasks(): WorkItem[];

    updateTask(id: string, updates: UpdateTaskPayload): void;

    addChildToTask(parentId: string, childId: string): void;

    removeChildFromTask(parentId: string, childId: string): void;

    removeTask(id: string): void;
}
