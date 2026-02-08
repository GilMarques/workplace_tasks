using Domain.Users;

namespace Api.Auth.DTOs
{
    public record SignupResponse(Guid Id, string Email, UserRole Role);
}
