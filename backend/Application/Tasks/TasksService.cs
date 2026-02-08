using System.ComponentModel.DataAnnotations;
using Application.Exceptions;
using Domain;
using Domain.Tasks;
using Domain.Users;
using Microsoft.AspNetCore.Identity;

namespace Application.Tasks
{
    public class TasksService : ITasksService
    {
        private readonly ITasksRepository _tasksRepository;

        public TasksService(ITasksRepository tasksRepository)
        {
            _tasksRepository = tasksRepository;
        }

        public async Task<PagedResult<TaskItem>> GetPaginatedAsync(
            int page,
            int pageSize,
            Domain.Tasks.TaskStatus? status,
            Guid? ownerId
        )
        {
            var res = await _tasksRepository.GetPaginatedAsync(page, pageSize, status, ownerId);
            return res;
        }

        public async Task<TaskItem> CreateAsync(
            string title,
            string description,
            Domain.Tasks.TaskStatus status,
            Guid? assignedToUserId,
            Guid currentUserId,
            UserRole currentUserRole
        )
        {
            if (assignedToUserId.HasValue)
            {
                EnsureUserCanAssign(currentUserRole, currentUserId, assignedToUserId.Value);
            }
            else
            {
                assignedToUserId = currentUserId;
            }

            var task = new TaskItem(
                Guid.NewGuid(),
                title,
                description,
                status,
                currentUserId,
                assignedToUserId.Value
            );

            await _tasksRepository.AddAsync(task);
            return task;
        }

        public async Task<TaskItem> UpdateAsync(
            Guid taskId,
            string? title,
            string? description,
            Domain.Tasks.TaskStatus? status,
            Guid? assignedToUserId,
            Guid currentUserId,
            UserRole currentUserRole
        )
        {
            var task =
                await _tasksRepository.GetByIdAsync(taskId)
                ?? throw new NotFoundException("Task not found");

            var wantsToUpdateContent = title != null || description != null;

            if (wantsToUpdateContent)
            {
                EnsureUserCanEditContent(currentUserRole, currentUserId, task);

                if (title == null || description == null)
                    throw new ValidationException(
                        "Title and description must be provided together."
                    );

                task.UpdateTitleAndDescription(title, description);
            }

            if (status.HasValue)
            {
                EnsureUserCanUpdateStatus(currentUserRole, currentUserId, task);
                task.UpdateStatus(status.Value);
            }

            if (assignedToUserId.HasValue)
            {
                EnsureUserCanAssign(currentUserRole, currentUserId, assignedToUserId.Value);
                task.AssignToUser(assignedToUserId.Value);
            }

            await _tasksRepository.UpdateAsync(task);
            return task;
        }

        public async Task DeleteAsync(Guid taskId, Guid currentUserId, UserRole currentUserRole)
        {
            var task =
                await _tasksRepository.GetByIdAsync(taskId)
                ?? throw new NotFoundException("Task not found");

            EnsureUserCanDelete(currentUserRole, currentUserId, task.CreatedByUserId);

            await _tasksRepository.DeleteAsync(task);
        }

        private static void EnsureUserCanAssign(
            UserRole currentUserRole,
            Guid currentUserId,
            Guid assignedToUserId
        )
        {
            if (currentUserRole == UserRole.Member && assignedToUserId != currentUserId)
            {
                throw new ForbiddenException("Members cannot assign tasks to other users.");
            }
        }

        private static void EnsureUserCanEditContent(UserRole role, Guid userId, TaskItem task)
        {
            if (role == UserRole.Member && task.CreatedByUserId != userId)
                throw new ForbiddenException(
                    "Members can only edit task content for tasks they created."
                );
        }

        private static void EnsureUserCanUpdateStatus(UserRole role, Guid userId, TaskItem task)
        {
            var isAssignee = task.AssignedToUserId == userId;

            if (role == UserRole.Member && !isAssignee)
                throw new ForbiddenException("Members can only update status of assigned tasks.");
        }

        private static void EnsureUserCanDelete(
            UserRole currentUserRole,
            Guid currentUserId,
            Guid createdByUserId
        )
        {
            if (currentUserRole == UserRole.Member && currentUserId != createdByUserId)
            {
                throw new ForbiddenException("Members can only delete their own created tasks");
            }

            if (currentUserRole == UserRole.Manager && currentUserId != createdByUserId)
            {
                throw new ForbiddenException("Managers can only delete their own created tasks");
            }
        }
    }
}
