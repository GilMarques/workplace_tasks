using System.ComponentModel.DataAnnotations;

namespace Api.Auth.DTOs
{
    public record SignupRequest
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Email must be a valid email address.")]
        public string Email { get; init; } = null!;

        [Required(ErrorMessage = "Email is required.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        public string Password { get; init; } = null!;
    };
}
