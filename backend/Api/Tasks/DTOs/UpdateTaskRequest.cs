using System.ComponentModel.DataAnnotations;

namespace Api.Tasks.DTOs
{
    public class UpdateTaskRequest
    {
        public string? Title { get; init; }

        public string? Description { get; init; }

        [Range(0, 2, ErrorMessage = "Invalid task status.")]
        public Domain.Tasks.TaskStatus? Status { get; init; }

        public Guid? AssignedToUserId { get; set; }
    }
}
