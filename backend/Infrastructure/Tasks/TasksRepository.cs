using Domain;
using Domain.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Tasks
{
    public class TasksRepository : ITasksRepository
    {
        private readonly ApplicationDbContext _db;

        public TasksRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(TaskItem task)
        {
            _db.Tasks.Add(task);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(TaskItem task)
        {
            _db.Tasks.Remove(task);
            await _db.SaveChangesAsync();
        }

        public async Task<TaskItem?> GetByIdAsync(Guid id)
        {
            return await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<PagedResult<TaskItem>> GetPaginatedAsync(
            int page,
            int pageSize,
            Domain.Tasks.TaskStatus? status,
            Guid? assignedToUserId
        )
        {
            var query = _db.Tasks.AsNoTracking().AsQueryable();

            if (status != null)
                query = query.Where(t => t.Status == status);

            if (assignedToUserId != null)
                query = query.Where(t => t.AssignedToUserId == assignedToUserId);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(u => u.CreatedAt)
                .ThenBy(u => u.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<TaskItem>(
                items: items,
                totalCount: totalCount,
                limit: pageSize,
                offset: (page - 1) * pageSize
            );
        }

        public async Task UpdateAsync(TaskItem task)
        {
            _db.Tasks.Update(task);
            await _db.SaveChangesAsync();
        }
    }
}
