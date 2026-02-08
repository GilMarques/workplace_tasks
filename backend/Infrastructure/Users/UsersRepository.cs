using Domain;
using Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Users
{
    public class UsersRepository : IUsersRepository
    {
        private readonly ApplicationDbContext _db;

        public UsersRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<PagedResult<User>> GetUsersAsync(
            int? page = null,
            int? pageSize = null,
            UserRole? role = null
        )
        {
            var query = _db.Users.AsNoTracking();

            if (role.HasValue)
                query = query.Where(u => u.Role == role.Value);

            var totalCount = await query.CountAsync();

            List<User> items;

            if (page.HasValue && pageSize.HasValue)
            {
                items = await query
                    .OrderByDescending(u => u.CreatedAt)
                    .ThenBy(u => u.Id)
                    .Skip((page.Value - 1) * pageSize.Value)
                    .Take(pageSize.Value)
                    .ToListAsync();
            }
            else
            {
                items = await query
                    .OrderByDescending(u => u.CreatedAt)
                    .ThenBy(u => u.Id)
                    .ToListAsync();
                pageSize = totalCount;
                page = 1;
            }

            return new PagedResult<User>(
                items: items,
                totalCount: totalCount,
                limit: pageSize.Value,
                offset: (page.Value - 1) * pageSize.Value
            );
        }

        public async Task AddAsync(User user)
        {
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(User user)
        {
            _db.Users.Update(user);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(User user)
        {
            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
        }
    }
}
