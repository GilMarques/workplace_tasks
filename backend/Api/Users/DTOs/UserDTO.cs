using System.ComponentModel.DataAnnotations;
using Domain.Users;

namespace Api.Users.DTOs
{
    public class UserDTO
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = null!;
        public UserRole Role { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
