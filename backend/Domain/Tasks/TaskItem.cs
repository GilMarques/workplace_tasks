using Domain.Users;

namespace Domain.Tasks
{
    public class TaskItem
    {
        public Guid Id { get; private set; }
        public string Title { get; private set; }
        public string Description { get; private set; }

        public TaskStatus Status { get; private set; }

        public DateTime CreatedAt { get; private set; }

        public DateTime UpdatedAt { get; private set; }

        public Guid CreatedByUserId { get; private set; }

        public Guid AssignedToUserId { get; private set; }

        public User CreatedByUser { get; private set; } = null!;

        public User AssignedToUser { get; private set; } = null!;

        public TaskItem(
            Guid id,
            string title,
            string description,
            TaskStatus status,
            Guid createdByUserId,
            Guid assignedToUserId
        )
        {
            Id = id;
            Title = title;
            Description = description;
            Status = status;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
            CreatedByUserId = createdByUserId;
            AssignedToUserId = assignedToUserId;
        }

        public void AssignToUser(Guid userId)
        {
            AssignedToUserId = userId;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateTitleAndDescription(string title, string description)
        {
            Title = title;
            Description = description;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateStatus(TaskStatus status)
        {
            Status = status;
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public enum TaskStatus
    {
        Done,
        InProgress,
        Pending,
    }
}
