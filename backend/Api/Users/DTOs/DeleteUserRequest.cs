using System.ComponentModel.DataAnnotations;

namespace Api.Users.DTOs
{
    public sealed record DeleteUserRequest
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Email must be a valid email address.")]
        public required string Email { get; init; }
    }
}
