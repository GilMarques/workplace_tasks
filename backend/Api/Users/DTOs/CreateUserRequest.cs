using System.ComponentModel.DataAnnotations;
using Domain.Users;

namespace Api.Users.DTOs
{
    public sealed record CreateUserRequest
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Email must be a valid email address.")]
        public required string Email { get; init; }

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        public required string Password { get; init; }

        [Range(0, 2, ErrorMessage = "Invalid User role.")]
        public UserRole? Role { get; init; }
    }
}
