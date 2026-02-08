using Application.Exceptions;
using Domain;
using Domain.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;

namespace Application.Users
{
    public class UsersService : IUsersService
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UsersService(IUsersRepository usersRepository, IPasswordHasher<User> passwordHasher)
        {
            _usersRepository = usersRepository;
            _passwordHasher = passwordHasher;
        }

        public async Task<PagedResult<User>> GetUsersAsync(int? page, int? pageSize, UserRole? role)
        {
            var users = await _usersRepository.GetUsersAsync(page, pageSize, role);
            return users;
        }

        public async Task<User> GetUserAsync(Guid id)
        {
            var user =
                await _usersRepository.GetByIdAsync(id)
                ?? throw new NotFoundException("User not found");
            return user;
        }

        public async Task<User> CreateAsync(string email, string password, UserRole? role)
        {
            await EnsureEmailIsUniqueAsync(email);

            var newUser = new User(Guid.NewGuid(), email, role ?? UserRole.Member);
            newUser.UpdatePassword(_passwordHasher.HashPassword(newUser, password));

            await _usersRepository.AddAsync(newUser);
            return newUser;
        }

        public async Task<User> UpdateAsync(
            Guid id,
            string? email,
            string? password,
            UserRole? role
        )
        {
            var user =
                await _usersRepository.GetByIdAsync(id)
                ?? throw new NotFoundException("User not found");

            if (email != null)
            {
                await EnsureEmailIsUniqueAsync(email, user.Id);
                user.UpdateEmail(email);
            }

            if (password != null)
                user.UpdatePassword(_passwordHasher.HashPassword(user, password));
            if (role != null)
                user.UpdateRole(role.Value);

            await _usersRepository.UpdateAsync(user);
            return user;
        }

        public async Task DeleteAsync(Guid id)
        {
            var user =
                await _usersRepository.GetByIdAsync(id)
                ?? throw new NotFoundException("User not found");
            ;
            await _usersRepository.DeleteAsync(user);
        }

        private async Task EnsureEmailIsUniqueAsync(string email, Guid? excludeUserId = null)
        {
            var existingUser = await _usersRepository.GetByEmailAsync(email);

            if (existingUser != null && existingUser.Id != excludeUserId)
                throw new AlreadyExistsException("Email already in use");
        }
    }
}
