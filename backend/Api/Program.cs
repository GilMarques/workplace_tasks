using System.Text;
using Api.Middleware;
using Application;
using Application.Auth;
using Domain.Users;
using Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200");
    });
});

var connectionString = builder.Configuration.GetConnectionString("Postgres");

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));

var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()!;

builder.Services.AddSingleton(jwtSettings);
builder.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();

builder
    .Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.SecretKey)
            ),
        };
    });

builder
    .Services.AddAuthorizationBuilder()
    .AddPolicy("Admin", policy => policy.RequireRole(UserRole.Admin.ToString()));

builder.Services.AddInfrastructure();
builder.Services.AddApplication();

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
    var emailsToDelete = new[] { "admin@example.com", "manager@example.com", "member@example.com" };

    var usersToDelete = db.Users.Where(u => emailsToDelete.Contains(u.Email)).ToList();

    if (usersToDelete.Any())
    {
        db.Users.RemoveRange(usersToDelete);
        db.SaveChanges();
    }
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    var adminEmail = "admin@example.com";
    if (!db.Users.Any(u => u.Email == adminEmail))
    {
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();

        var adminUser = new User(Guid.NewGuid(), adminEmail, UserRole.Admin);

        adminUser.UpdatePassword(hasher.HashPassword(adminUser, "adminadmin"));

        db.Users.Add(adminUser);
        db.SaveChanges();
    }
    var managerEmail = "manager@example.com";
    if (!db.Users.Any(u => u.Email == managerEmail))
    {
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();

        var managerUser = new User(Guid.NewGuid(), managerEmail, UserRole.Manager);

        managerUser.UpdatePassword(hasher.HashPassword(managerUser, "managermanager"));

        db.Users.Add(managerUser);
        db.SaveChanges();
    }
    var member = "member@example.com";
    if (!db.Users.Any(u => u.Email == member))
    {
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();

        var memberUser = new User(Guid.NewGuid(), member, UserRole.Member);

        memberUser.UpdatePassword(hasher.HashPassword(memberUser, "membermember"));

        db.Users.Add(memberUser);
        db.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ExceptionMiddleware>();

app.MapControllers();

app.Run();
