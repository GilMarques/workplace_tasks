using System.Security.Claims;
using Domain.Users;

namespace Api.Identity
{
    public static class CurrentUserExtensions
    {
        public static Guid GetUserId(this ClaimsPrincipal user) =>
            Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

        public static UserRole GetUserRole(this ClaimsPrincipal user) =>
            Enum.Parse<UserRole>(user.FindFirstValue(ClaimTypes.Role)!);
    }
}
