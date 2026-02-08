using Api.Identity;
using Api.Users.DTOs;
using Application.Users;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Users
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UsersService _users;

        public UsersController(UsersService users)
        {
            _users = users;
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult> GetMe()
        {
            var userId = User.GetUserId();
            var user = await _users.GetUserAsync(userId);

            var res = new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
            };

            return Ok(res);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult> GetUsers([FromQuery] GetUsersRequest request)
        {
            var page = request.Page ?? 1;
            var pageSize = request.PageSize ?? 10;
            var offset = (page - 1) * pageSize;

            var users = await _users.GetUsersAsync(request.Page, request.PageSize, request.Role);

            var res = new PagedResult<UserDTO>(
                items: users
                    .Items.Select(u => new UserDTO
                    {
                        Id = u.Id,
                        Email = u.Email,
                        Role = u.Role,
                        CreatedAt = u.CreatedAt,
                    })
                    .ToList(),
                totalCount: users.TotalCount,
                limit: users.Limit,
                offset: users.Offset
            );

            return Ok(res);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> CreateUser(CreateUserRequest request)
        {
            var user = await _users.CreateAsync(request.Email, request.Password, request.Role);

            var res = new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
            };

            return Ok(res);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser(Guid id, UpdateUserRequest request)
        {
            var user = await _users.UpdateAsync(id, request.Email, request.Password, request.Role);

            var res = new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
            };

            return Ok(res);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(Guid id)
        {
            await _users.DeleteAsync(id);
            return Ok();
        }
    }
}
