using Domain.Tasks;

namespace Domain.Users
{
    public class User
    {
        public Guid Id { get; private set; }
        public string Email { get; private set; }
        public string PasswordHash { get; private set; } = string.Empty;

        public UserRole Role { get; private set; }

        public DateTime CreatedAt { get; private set; }

        public ICollection<TaskItem> CreatedTasks { get; private set; } = new List<TaskItem>();

        public ICollection<TaskItem> AssignedTasks { get; private set; } = new List<TaskItem>();

        public User(Guid id, string email, UserRole role)
        {
            Id = id;
            Email = email;
            Role = role;
            CreatedAt = DateTime.UtcNow;
        }

        public void UpdateEmail(string email)
        {
            Email = email;
        }

        public void UpdatePassword(string passwordHash)
        {
            PasswordHash = passwordHash;
        }

        public void UpdateRole(UserRole role)
        {
            Role = role;
        }
    }

    public enum UserRole
    {
        Admin,
        Manager,
        Member,
    }
}
