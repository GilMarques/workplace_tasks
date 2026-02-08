using Domain;
using Domain.Tasks;
using Domain.Users;

namespace Application.Tasks
{
    public interface ITasksService
    {
        Task<PagedResult<TaskItem>> GetPaginatedAsync(
            int page,
            int pageSize,
            Domain.Tasks.TaskStatus? status,
            Guid? ownerId
        );

        Task<TaskItem> CreateAsync(
            string title,
            string description,
            Domain.Tasks.TaskStatus status,
            Guid? assignedToUserId,
            Guid currentUserId,
            UserRole currentUserRole
        );
        Task<TaskItem> UpdateAsync(
            Guid taskId,
            string? title,
            string? description,
            Domain.Tasks.TaskStatus? status,
            Guid? assignedToUserId,
            Guid currentUserId,
            UserRole currentUserRole
        );
        Task DeleteAsync(Guid taskId, Guid currentUserId, UserRole currentUserRole);
    }
}
