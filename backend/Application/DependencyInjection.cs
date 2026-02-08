using Application.Auth;
using Application.Tasks;
using Application.Users;
using Microsoft.Extensions.DependencyInjection;

namespace Application
{
    public static class ApplicationDependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<JwtService>();
            services.AddScoped<AuthService>();
            services.AddScoped<UsersService>();
            services.AddScoped<TasksService>();
            return services;
        }
    }
}
