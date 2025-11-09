import {Priority, Status, WorkItemType} from "./modules/tasks/task.constants";
import {TaskService} from "./modules/tasks/task.service";
import {TaskController} from "./modules/tasks/task.controller";

const service = new TaskService();
const controller = new TaskController(service);
// Showcase validation errors using controller
// 1. Title too short
controller.createTask(WorkItemType.TASK, {
    id: 'T-001',
    title: 'ab', // too short
    createdAt: new Date(),
});

// 2. Title too long
controller.createTask(WorkItemType.TASK, {
    id: 'T-002',
    title: 'a'.repeat(101), // too long
    createdAt: new Date(),
});

// 3. Invalid date format for createdAt
controller.createTask(WorkItemType.TASK, {
    id: 'T-003',
    title: 'Valid Title',
    createdAt: 'not-a-date', // invalid
});

// 4. Deadline in the past
controller.createTask(WorkItemType.TASK, {
    id: 'T-004',
    title: 'Valid Title',
    createdAt: new Date(),
    deadline: new Date('2000-01-01'), // past
});

// 5. Status not in allowed enum
controller.createTask(WorkItemType.TASK, {
    id: 'T-005',
    title: 'Valid Title',
    createdAt: new Date(),
    status: 'NOT_A_STATUS', // invalid
});

// 6. Priority not in allowed enum
controller.createTask(WorkItemType.TASK, {
    id: 'T-006',
    title: 'Valid Title',
    createdAt: new Date(),
    priority: 'NOT_A_PRIORITY', // invalid
});

// 7. Description too short
controller.createTask(WorkItemType.TASK, {
    id: 'T-007',
    title: 'Valid Title',
    createdAt: new Date(),
    description: 'short', // too short
});

// 8. Description too long
controller.createTask(WorkItemType.TASK, {
    id: 'T-008',
    title: 'Valid Title',
    createdAt: new Date(),
    description: 'a'.repeat(201), // too long
});

// 9. doneAt not a valid date
controller.createTask(WorkItemType.TASK, {
    id: 'T-009',
    title: 'Valid Title',
    createdAt: new Date(),
    doneAt: 'not-a-date', // invalid
});

// 10. doneAt in the past (if not allowed)
controller.createTask(WorkItemType.TASK, {
    id: 'T-010',
    title: 'Valid Title',
    createdAt: new Date(),
    doneAt: new Date('2000-01-01'), // past
});

// 11. Deadline before createdAt (violates @isAfter('createdAt'))
controller.createTask(WorkItemType.TASK, {
    id: 'T-011',
    title: 'Valid Title',
    createdAt: new Date('2025-10-27'),
    deadline: new Date('2025-10-26'), // before createdAt
});

// 12. doneAt before createdAt (violates @isAfter('createdAt'))
controller.createTask(WorkItemType.TASK, {
    id: 'T-012',
    title: 'Valid Title',
    createdAt: new Date('2025-10-27'),
    doneAt: new Date('2025-10-26'), // before createdAt
});

// 13. createdAt in the future (violates @isInPast)
controller.createTask(WorkItemType.TASK, {
    id: 'T-013',
    title: 'Valid Title',
    createdAt: new Date('2025-11-01'), // future
});

// 14. title as a number (violates @isString)
controller.createTask(WorkItemType.TASK, {
    id: 'T-014',
    title: 12345 as any, // not a string
    createdAt: new Date('2025-10-27'),
});

// 15. deadline as a boolean (violates @inferToDate)
controller.createTask(WorkItemType.TASK, {
    id: 'T-015',
    title: 'Valid Title',
    createdAt: new Date('2025-10-27'),
    deadline: true as any, // not a date
});

// 16. status as a number (violates @isPartOfEnum(Status))
controller.createTask(WorkItemType.TASK, {
    id: 'T-016',
    title: 'Valid Title',
    createdAt: new Date('2025-10-27'),
    status: 123 as any, // not a valid enum value
});

// 17. priority as a number (violates @isPartOfEnum(Priority))
controller.createTask(WorkItemType.TASK, {
    id: 'T-017',
    title: 'Valid Title',
    createdAt: new Date('2025-10-27'),
    priority: 456 as any, // not a valid enum value
});

// 18. description as a non-string (violates @isString)
controller.createTask(WorkItemType.TASK, {
    id: 'T-018',
    title: 'Valid Title',
    createdAt: new Date('2025-10-27'),
    description: { text: 'not a string' } as any, // not a string
});

// Display all created tasks after validation error demonstrations
console.log('=============================');
console.log('All tasks after showcasing validation errors:');
controller.printErrors();

// 10 correct cases
controller.createTask(WorkItemType.TASK, {
    id: 'T-101',
    title: 'Implement login feature',
    createdAt: new Date('2025-10-27'),
    // Only required fields
});

controller.createTask(WorkItemType.TASK, {
    id: 'T-102',
    title: 'Write documentation',
    createdAt: new Date('2025-10-27'),
    status: Status.IN_PROGRESS,
    // No priority, description, deadline
});

controller.createTask(WorkItemType.TASK, {
    id: 'T-103',
    title: 'Fix bug in payment module',
    createdAt: new Date('2025-10-27'),
    status: Status.DONE,
    priority: Priority.LOW,
    // No description, deadline, doneAt
});

controller.createTask(WorkItemType.TASK, {
    id: 'T-104',
    title: 'Refactor codebase',
    createdAt: new Date('2025-10-27'),
    // Only required fields
});

controller.createTask(WorkItemType.TASK, {
    id: 'T-105',
    title: 'Design new logo',
    createdAt: new Date('2025-10-27'),
    priority: Priority.HIGH,
    // No status, description, deadline
});

controller.createTask(WorkItemType.TASK, {
    id: 'T-106',
    title: 'Prepare release notes',
    createdAt: new Date('2025-10-27'),
    description: 'Draft release notes for version 2.0.',
    // No status, priority, deadline
});

controller.createTask(WorkItemType.TASK, {
    id: 'T-107',
    title: 'Optimize database queries',
    createdAt: new Date('2025-10-27'),
    status: Status.IN_PROGRESS,
    priority: Priority.HIGH,
    // No description, deadline
});

controller.createTask(WorkItemType.TASK, {
    id: 'T-108',
    title: 'Set up CI/CD pipeline',
    createdAt: new Date('2025-10-27'),
    // Only required fields
});

controller.createTask(WorkItemType.TASK, {
    id: 'T-109',
    title: 'Conduct user interviews',
    createdAt: new Date('2025-10-27'),
    status: Status.IN_PROGRESS,
    // No priority, description, deadline
});

controller.createTask(WorkItemType.TASK, {
    id: 'T-110',
    title: 'Update dependencies',
    createdAt: new Date('2025-10-27'),
    // Only required fields
});

// Showcase service errors using controller
// 1. Duplicate Task ID
controller.createTask(WorkItemType.TASK, {
    id: 'T-101', // Already exists
    title: 'Duplicate ID',
    createdAt: new Date('2025-10-27'),
});

// 2. Unknown WorkItemType (simulate by casting)
controller.createTask('UNKNOWN_TYPE' as any, {
    id: 'T-999',
    title: 'Unknown Type',
    createdAt: new Date('2025-10-27'),
});

// 3. Get Nonexistent Task
controller.getTask('NON_EXISTENT_ID');

// 4. Update Nonexistent Task
controller.updateTask('NON_EXISTENT_ID', { title: 'Should Fail' });

// 5. Remove Nonexistent Task
controller.removeTask('NON_EXISTENT_ID');

// 6. Add Child to Nonexistent Parent
controller.addChildToTask('NON_EXISTENT_PARENT', 'T-101');

// 7. Add Child to Nonexistent Child
controller.addChildToTask('T-101', 'NON_EXISTENT_CHILD');

// 8. Add Child to Task That Cannot Have Children (Subtask)
controller.createTask(WorkItemType.SUBTASK, {
    id: 'ST-201',
    title: 'Subtask',
    createdAt: new Date('2025-10-27'),
});
controller.addChildToTask('ST-201', 'T-101');

// 9. Remove Child from Nonexistent Parent
controller.removeChildFromTask('NON_EXISTENT_PARENT', 'T-101');

// 10. Remove Child from Task That Cannot Have Children (Bug)
controller.createTask(WorkItemType.BUG, {
    id: 'B-301',
    title: 'Bug',
    createdAt: new Date('2025-10-27'),
});
controller.removeChildFromTask('B-301', 'T-101');

console.log('=============================');
console.log('Errors encountered:');
controller.printErrors();

console.log('=============================');
console.log('All tasks after adding correct cases:');
controller.getAllTasks().forEach(task => {
    task.getTaskInfo();
    console.log('-----------------------------');

});