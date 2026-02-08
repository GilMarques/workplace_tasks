using Application.Exceptions;

namespace Api.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";

                switch (ex)
                {
                    case NotFoundException:
                        context.Response.StatusCode = StatusCodes.Status404NotFound;
                        break;
                    case ForbiddenException:
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        break;

                    case AlreadyExistsException:
                        context.Response.StatusCode = StatusCodes.Status409Conflict;
                        break;

                    default:
                        context.Response.StatusCode = StatusCodes.Status400BadRequest;
                        break;
                }

                await context.Response.WriteAsJsonAsync(new { error = ex.Message });
            }
        }
    }
}
