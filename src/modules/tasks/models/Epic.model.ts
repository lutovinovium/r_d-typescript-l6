import {WorkItemType} from "../task.constants";
import {TaskBaseWithChildren} from "./TaskBaseWithChildren.model";
import {TaskBase} from "./TaskBase.model";

export class Epic extends TaskBaseWithChildren {
    type = WorkItemType.EPIC;

    getTaskInfo(): void {
        TaskBase.formatText(this.id, 'id');
        TaskBase.formatText(this.title, 'title');
        TaskBase.formatText(this.description, 'description');
        TaskBase.formatEnum(this.status, 'status');
        TaskBase.formatEnum(this.priority, 'priority');
        TaskBase.formatDate(this.createdAt, 'created at');
        TaskBase.formatDate(this.deadline, 'deadline');
        TaskBase.formatArray(this.children, 'children');
    }
}