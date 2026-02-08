using System.ComponentModel.DataAnnotations;

namespace Api.Tasks.DTOs
{
    public record CreateTaskRequest
    {
        [Required(ErrorMessage = "Title is required.")]
        public string Title { get; init; } = null!;

        [Required(ErrorMessage = "Description is required.")]
        public string Description { get; init; } = null!;

        [Range(0, 2, ErrorMessage = "Invalid task status.")]
        public Domain.Tasks.TaskStatus Status { get; init; } = Domain.Tasks.TaskStatus.Pending;

        public Guid? AssignedToUserId { get; set; }
    }
}
