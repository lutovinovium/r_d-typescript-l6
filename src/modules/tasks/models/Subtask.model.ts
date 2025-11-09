import {WorkItemType} from "../task.constants";
import {TaskBase} from "./TaskBase.model";

export class Subtask extends TaskBase {
    type = WorkItemType.SUBTASK;

    getTaskInfo(): void {
        TaskBase.formatText(this.id, 'id');
        TaskBase.formatText(this.title, 'title');
        TaskBase.formatText(this.description, 'description');
        TaskBase.formatEnum(this.status, 'status');
        TaskBase.formatEnum(this.priority, 'priority');
        TaskBase.formatDate(this.createdAt, 'created at');
        TaskBase.formatDate(this.deadline, 'deadline');
    }
}