using Domain.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Tasks
{
    public class TasksConfiguration : IEntityTypeConfiguration<TaskItem>
    {
        public void Configure(EntityTypeBuilder<TaskItem> builder)
        {
            builder.ToTable("Tasks");

            builder.HasKey(t => t.Id);

            builder.Property(t => t.Title).IsRequired();

            builder.Property(t => t.Description).IsRequired();

            builder.Property(t => t.Status).IsRequired();

            builder.Property(t => t.CreatedAt).IsRequired();

            builder.Property(t => t.UpdatedAt).IsRequired();

            builder
                .HasOne(t => t.AssignedToUser)
                .WithMany(u => u.AssignedTasks)
                .HasForeignKey(t => t.AssignedToUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
