using System.ComponentModel.DataAnnotations;
using Domain.Users;

namespace Api.Users.DTOs
{
    public sealed record GetUsersRequest
    {
        [Range(0, 2, ErrorMessage = "Invalid User role.")]
        public UserRole? Role { get; init; } = null;

        [Range(1, int.MaxValue)]
        public int? Page { get; init; }

        [Range(1, 100)]
        public int? PageSize { get; init; }
    }
}
