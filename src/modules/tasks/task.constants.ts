export enum WorkItemType {
    EPIC = 'epic',
    STORY = 'story',
    TASK = 'task',
    SUBTASK = 'subtask',
    BUG = 'bug'
}

export enum Status {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    DONE = "done",
}

export enum Priority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
}

export const requiredMetadataKey = Symbol("required");
export const initializedMetadataKey = Symbol("initialized");
export const classValidatorsKey = Symbol("classValidators");
