using Application.Exceptions;
using Domain.Users;
using Microsoft.AspNetCore.Identity;

namespace Application.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IUsersRepository _usersRepository;
        private readonly JwtService _tokenService;

        private readonly IPasswordHasher<User> _passwordHasher;

        public AuthService(
            IUsersRepository usersRepository,
            JwtService tokenService,
            IPasswordHasher<User> passwordHasher
        )
        {
            _usersRepository = usersRepository;
            _tokenService = tokenService;
            _passwordHasher = passwordHasher;
        }

        public async Task<User> RegisterAsync(string email, string password)
        {
            var existingUser = await _usersRepository.GetByEmailAsync(email);
            if (existingUser != null)
                throw new AlreadyExistsException("Email already in use");

            var user = new User(Guid.NewGuid(), email, UserRole.Member);
            user.UpdatePassword(_passwordHasher.HashPassword(user, password));

            await _usersRepository.AddAsync(user);
            return user;
        }

        public async Task<string?> AuthenticateAsync(string email, string password)
        {
            var user = await _usersRepository.GetByEmailAsync(email);

            if (user == null)
                return null;
            var res = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (res == PasswordVerificationResult.Failed)
                return null;

            var token = _tokenService.GenerateToken(user.Id, user.Email, user.Role.ToString());

            return token;
        }
    }
}
