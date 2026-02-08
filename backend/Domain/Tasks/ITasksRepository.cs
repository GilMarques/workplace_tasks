namespace Domain.Tasks
{
    public interface ITasksRepository
    {
        Task<TaskItem?> GetByIdAsync(Guid id);
        Task<PagedResult<TaskItem>> GetPaginatedAsync(
            int page,
            int pageSize,
            TaskStatus? status,
            Guid? assignedToUserId
        );

        Task AddAsync(TaskItem task);
        Task UpdateAsync(TaskItem task);
        Task DeleteAsync(TaskItem task);
    }
}
