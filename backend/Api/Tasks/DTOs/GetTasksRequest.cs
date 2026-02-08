using System.ComponentModel.DataAnnotations;
using Domain.Users;

namespace Api.Tasks.DTOs
{
    public class GetTasksRequest
    {
        [Range(1, int.MaxValue)]
        public int Page { get; init; } = 1;

        [Range(1, 100)]
        public int PageSize { get; init; } = 20;

        public Domain.Tasks.TaskStatus? Status { get; init; } = null;

        public Guid? OwnerId { get; init; } = null;
    }
}
