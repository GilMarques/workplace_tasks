using Api.Identity;
using Api.Tasks.DTOs;
using Application.Tasks;
using Domain.Tasks;
using Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Tasks
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly TasksService _tasks;

        public TasksController(TasksService tasks)
        {
            _tasks = tasks;
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks([FromQuery] GetTasksRequest request)
        {
            var tasks = await _tasks.GetPaginatedAsync(
                request.Page,
                request.PageSize,
                request.Status,
                request.OwnerId
            );

            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask(CreateTaskRequest request)
        {
            var userId = User.GetUserId();
            var userRole = User.GetUserRole();
            var task = await _tasks.CreateAsync(
                request.Title,
                request.Description,
                request.Status,
                request.AssignedToUserId,
                userId,
                userRole
            );

            return CreatedAtAction(nameof(CreateTask), task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(Guid id, UpdateTaskRequest request)
        {
            var userId = User.GetUserId();
            UserRole userRole = User.GetUserRole();
            var task = await _tasks.UpdateAsync(
                id,
                request.Title,
                request.Description,
                request.Status,
                request.AssignedToUserId,
                userId,
                userRole
            );
            return Ok(task);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var userId = User.GetUserId();
            UserRole userRole = User.GetUserRole();
            await _tasks.DeleteAsync(id, userId, userRole);
            return NoContent();
        }
    }
}
