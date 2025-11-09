import type {CreateTaskPayload, ITaskBase, TaskBaseSerialised, WithChildren} from "../task.types";
import {TaskBase} from "./TaskBase.model";

export abstract class TaskBaseWithChildren extends TaskBase implements ITaskBase, WithChildren {
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
