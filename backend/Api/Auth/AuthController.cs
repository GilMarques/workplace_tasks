using Api.Auth.DTOs;
using Application.Auth;
using Microsoft.AspNetCore.Mvc;

namespace Api.Auth
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _auth;

        public AuthController(AuthService auth)
        {
            _auth = auth;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var accessToken = await _auth.AuthenticateAsync(request.Email, request.Password);

            if (accessToken == null)
                return Unauthorized("Invalid email or password");

            return Ok(new LoginResponse(accessToken));
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupRequest request)
        {
            var user = await _auth.RegisterAsync(request.Email, request.Password);
            return Created(nameof(Signup), new SignupResponse(user.Id, user.Email, user.Role));
        }
    }
}
