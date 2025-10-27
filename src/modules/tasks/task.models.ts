import type {CreateTaskPayload, ITaskBase, TaskBaseSerialised, UpdateTaskPayload, WithChildren} from "./task.types";
import {Priority, Status, WorkItemType} from "./task.constants";
import {
    inferToDate,
    isAfter,
    isCorrectDate,
    isInPast,
    isPartOfEnum,
    isString,
    required,
    stringMaxLength,
    stringMinLength,
    withValidation
} from "./task.decorators";

@withValidation
abstract class TaskBase implements ITaskBase {
    readonly type: WorkItemType = WorkItemType.TASK;
    readonly id: string;

    _title!: string;
    @required
    @isString
    @stringMinLength(3)
    @stringMaxLength(100)
    set title(value: unknown) {
        this._title = value as string;
    }

    get title(): string {
        return this._title;
    }

    _createdAt!: Date;
    @required
    @inferToDate
    @isCorrectDate
    @isInPast
    set createdAt(value: unknown) {
        this._createdAt = value as Date;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    _status!: Status;
    @isPartOfEnum(Status)
    set status(value: unknown) {
        if (this._doneAt && this._status === Status.DONE && value !== Status.DONE) {
            this._doneAt = undefined;
        }
        this._status = value as Status;
    }

    get status(): Status {
        return this._status;
    }

    _priority!: Priority;
    @isPartOfEnum(Priority)
    set priority(value: unknown) {
        this._priority = value as Priority;
    }

    get priority(): Priority {
        return this._priority;
    }

    _description?: string;
    @isString
    @stringMinLength(10)
    @stringMaxLength(200)
    set description(value: unknown) {
        this._description = value as string;
    }

    get description(): string | undefined {
        return this._description;
    }

    _deadline?: Date;
    @inferToDate
    @isCorrectDate
    @isAfter('createdAt')
    set deadline(value: unknown) {
        this._deadline = value as Date;
    }

    get deadline(): Date | undefined {
        return this._deadline;
    }

    _doneAt?: Date;
    @inferToDate
    @isCorrectDate
    @isInPast
    @isAfter('createdAt')
    set doneAt(value: unknown) {
        this._doneAt = value as Date;
        if (!value && this.status === Status.DONE) {
            this.status = Status.IN_PROGRESS;
        }
    }

    get doneAt(): Date | undefined {
        return this._doneAt;
    }

    constructor(
        {id, title, deadline, doneAt, description, status, createdAt, priority}: CreateTaskPayload,
    ) {
        this.id = id;
        this.title = title;
        this.createdAt = createdAt || new Date();
        this.status = status || Status.TODO;
        this.priority = priority || Priority.MEDIUM;
        this.description = description;
        this.deadline = deadline;
        this.doneAt = doneAt;
    }

    displayInfo(): void {
        TaskBase.formatText(this.id, 'id');
        TaskBase.formatText(this.title, 'title');
        TaskBase.formatText(this.description, 'description');
        TaskBase.formatEnum(this.status, 'status');
        TaskBase.formatEnum(this.priority, 'priority');
        TaskBase.formatDate(this.createdAt, 'created at');
        TaskBase.formatDate(this.deadline, 'deadline');
    }


    get JSON(): TaskBaseSerialised {
        return {
            id: this.id,
            type: this.type,
            title: this.title,
            createdAt: this.createdAt.toISOString(),
            status: this.status,
            priority: this.priority,
            description: this.description,
            deadline: this.deadline?.toISOString(),
            doneAt: this.doneAt?.toISOString(),
        };
    }

    get isDoneInTime() {
        if (!this.doneAt) {
            console.error('Task have not been done yet');
            return false;
        }
        if (!this.deadline) {
            console.error('Task does not have deadline specified');
            return false;
        }

        return this.deadline > this.doneAt
    }

    updateDetails(updates: UpdateTaskPayload): void {
        Object.entries(updates).forEach(([_key, value]) => {
            const key = _key as keyof UpdateTaskPayload;
            this[key] = value;
        });
    }

    protected _isIterableObject(input: unknown): input is { [key: string]: unknown } {
        return !!input && typeof input === 'object';
    }

    protected _isCompatible(input: unknown): input is CreateTaskPayload {
        const isString = (input: unknown) => typeof input === 'string';
        const isDate = (input: unknown) => input instanceof Date;
        const isUndefined = (input: unknown) => input === undefined;

        if (!this._isIterableObject(input)) return false;
        const {id, title, createdAt, status, priority, description, deadline, doneAt} = input;
        if (!isString(id)) return false;
        if (!isString(title)) return false;
        if (!isString(description) || !isUndefined(description)) return false;
        if (!isDate(createdAt) || isString(createdAt) || isUndefined(createdAt)) return false;
        if (!isDate(deadline) || isString(deadline) || isUndefined(deadline)) return false;
        if (!isDate(doneAt) || isString(doneAt) || isUndefined(doneAt)) return false;
        if (!isString(status) || !isUndefined(status)) return false;
        if (!isString(priority) || !isUndefined(priority)) return false;
        return true;
    }
    private static display(value: string | number, key: string): void {
        let displayedKey = `${key.toUpperCase()}:`;
        const tabulations = `${displayedKey.length > 8 ? '' : '\t'}\t\t`;
        console.log(`${displayedKey}${tabulations}${value}`);
    }

    private static formatDate(value: Date | string | undefined, key: string) {
        if (!value) return '';
        const str = new Date(value).toLocaleDateString();
        this.display(str, key);
    }

    private static formatText(value: string | number | undefined, key: string) {
        if (value === undefined) return '';
        this.display(String(value), key);
    }

    private static formatEnum(value: Status | Priority | undefined, key: string) {
        if (value === undefined) return '';
        const str = value.charAt(0).toUpperCase() + value.substring(1).replace('_', ' ').toLowerCase()
        this.display(str, key);
    }
}


abstract class TaskBaseWithChildren extends TaskBase implements ITaskBase, WithChildren {
    children: string[];

    constructor(
        {children, ...payload}: CreateTaskPayload & Partial<WithChildren>,
    ) {
        super(payload);
        this.children = children || [];
    }

    addChild(childId: string): void {
        this.children.push(childId);
    }

    removeChild(childId: string): void {
        this.children = this.children.filter(c => c !== childId);
    }

    _isCompatible(input: unknown): input is (CreateTaskPayload & Partial<WithChildren>) {
        if (!this._isIterableObject(input)) return false;
        return  input.children === undefined || Array.isArray(input.children) && super._isCompatible(input);
    }

    get JSON(): TaskBaseSerialised & WithChildren {
        const withoutChildren = super.JSON;
        return {
            ...withoutChildren,
            children: this.children,
        };
    }
}

export class Epic extends TaskBaseWithChildren {
    type = WorkItemType.EPIC;
}

export class Story extends TaskBaseWithChildren {
    type = WorkItemType.STORY;
}

export class Task extends TaskBaseWithChildren {
    type = WorkItemType.TASK;
}

export class Subtask extends TaskBase {
    type = WorkItemType.SUBTASK;
}

export class Bug extends TaskBase {
    type = WorkItemType.BUG;
}