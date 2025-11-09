import {WorkItemType} from "./task.constants";
import {Epic} from "./models/Epic.model";
import {Story} from "./models/Story.model";
import {Task} from "./models/Task.model";
import {Subtask} from "./models/Subtask.model";
import {Bug} from "./models/Bug.model";

export type ITaskBase = {
    type: WorkItemType;
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    createdAt: Date | string;
    deadline?: Date | string;
    doneAt?: Date | string;
}

export type WithChildren = {
    children: string[];
}

export type TaskBaseSerialised = ITaskBase & {
    createdAt: string;
    doneAt?: string;
    deadline?: string;
}

export type CreateTaskPayload = Omit<ITaskBase, 'type' | 'status' | 'priority' | 'createdAt'> & Partial<Pick<ITaskBase, 'status' | 'priority' | 'createdAt'>>;

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
