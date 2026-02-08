using System.ComponentModel.DataAnnotations;
using Domain.Users;

namespace Api.Users.DTOs
{
    public sealed record UpdateUserRequest
    {
        [EmailAddress(ErrorMessage = "Email must be a valid email address.")]
        public string? Email { get; init; }

        [MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        public string? Password { get; init; }

        [Range(0, 2, ErrorMessage = "Invalid User role.")]
        public UserRole? Role { get; init; }
    }
}
