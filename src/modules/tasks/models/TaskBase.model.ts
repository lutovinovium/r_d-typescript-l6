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
} from "../task.decorators";
import type {CreateTaskPayload, ITaskBase, TaskBaseSerialised, UpdateTaskPayload} from "../task.types";
import {Priority, Status, WorkItemType} from "../task.constants";

@withValidation
export abstract class TaskBase implements ITaskBase {
    abstract readonly type: WorkItemType;
    readonly id: string;

    _title!: string;
    @required
    @isString
    @stringMinLength(3)
    @stringMaxLength(100)
    set title(value) {
        this._title = value;
    }

    get title(): string {
        return this._title;
    }

    _createdAt: Date = new Date();
    @required
    @inferToDate
    @isCorrectDate
    @isInPast
    set createdAt(value) {
        this._createdAt = value;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    _status: Status = Status.TODO;
    @isPartOfEnum(Status)
    set status(value) {
        if (this._doneAt && this._status === Status.DONE && value !== Status.DONE) {
            this._doneAt = undefined;
        }
        this._status = value;
    }

    get status(): Status {
        return this._status;
    }

    _priority: Priority = Priority.MEDIUM;
    @isPartOfEnum(Priority)
    set priority(value) {
        this._priority = value;
    }

    get priority(): Priority {
        return this._priority;
    }

    _description?: string;
    @isString
    @stringMinLength(10)
    @stringMaxLength(200)
    set description(value) {
        this._description = value;
    }

    get description(): string | undefined {
        return this._description;
    }

    _deadline?: Date;
    @inferToDate
    @isCorrectDate
    @isAfter('createdAt')
    set deadline(value) {
        this._deadline = value;
    }

    get deadline(): Date | undefined {
        return this._deadline;
    }

    _doneAt?: Date;
    @inferToDate
    @isCorrectDate
    @isInPast
    @isAfter('createdAt')
    set doneAt(value) {
        this._doneAt = value;
        if (!value && this.status === Status.DONE) {
            this.status = Status.IN_PROGRESS;
        }
    }

    get doneAt(): Date | undefined {
        return this._doneAt;
    }

    constructor(
        {id, title, deadline, doneAt, description, status, createdAt, priority}: {
            id: string;
            title: string;
            description?: string;
            status?: string;
            priority?: string;
            createdAt?: Date | string;
            deadline?: Date | string;
            doneAt?: Date | string;
        },
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        if (status) {
            this.status = status as Status;
        }
        if (priority) {
            this.priority = priority as Priority;
        }
        if (createdAt) {
            this.createdAt = createdAt as Date;
        }
        if (deadline) {
            this.deadline = deadline as Date;
        }
        if (doneAt) {
            this.doneAt = doneAt as Date;
        }
    }

    abstract getTaskInfo(): void;


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
            (this as Record<keyof UpdateTaskPayload, unknown>)[key]  = value;
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

    protected static formatDate(value: Date | string | undefined, key: string) {
        if (!value) return '';
        const str = new Date(value).toLocaleDateString();
        this.display(str, key);
    }

    protected static formatText(value: string | number | undefined, key: string) {
        if (value === undefined) return '';
        this.display(String(value), key);
    }

    protected static formatEnum(value: Status | Priority | undefined, key: string) {
        if (value === undefined) return '';
        const str = value.charAt(0).toUpperCase() + value.substring(1).replace('_', ' ').toLowerCase()
        this.display(str, key);
    }

    protected static formatArray(values: string[] | undefined, key: string) {
        if (!values || values.length === 0) return '';
        const str = values.join(', ');
        this.display(str, key);
    }
}