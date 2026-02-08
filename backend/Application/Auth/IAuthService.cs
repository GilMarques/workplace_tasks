using Domain.Users;

namespace Application.Auth
{
    public interface IAuthService
    {
        Task<User> RegisterAsync(string email, string password);

        Task<string?> AuthenticateAsync(string email, string password);
    }
}
