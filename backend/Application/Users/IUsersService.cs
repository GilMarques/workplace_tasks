using Domain;
using Domain.Users;

namespace Application.Users
{
    public interface IUsersService
    {
        Task<PagedResult<User>> GetUsersAsync(int? page, int? pageSize, UserRole? role);
        Task<User> GetUserAsync(Guid id);
        Task<User> CreateAsync(string email, string password, UserRole? role);
        Task<User> UpdateAsync(Guid id, string? email, string? password, UserRole? role);
        Task DeleteAsync(Guid id);
    }
}
