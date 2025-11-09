import {WorkItemType} from "../task.constants";
import {TaskBase} from "./TaskBase.model";

export class Bug extends TaskBase {
    type = WorkItemType.BUG;

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