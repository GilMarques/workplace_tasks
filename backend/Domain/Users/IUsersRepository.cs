namespace Domain.Users
{
    public interface IUsersRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(Guid id);

        Task<PagedResult<User>> GetUsersAsync(int? page, int? pageSize, UserRole? role);

        Task AddAsync(User user);
        Task UpdateAsync(User user);

        Task DeleteAsync(User user);
    }
}
