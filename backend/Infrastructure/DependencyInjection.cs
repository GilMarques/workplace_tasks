using Domain.Tasks;
using Domain.Users;
using Infrastructure.Tasks;
using Infrastructure.Users;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class InfrastructureDependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddScoped<IUsersRepository, UsersRepository>();
            services.AddScoped<ITasksRepository, TasksRepository>();
            return services;
        }
    }
}
