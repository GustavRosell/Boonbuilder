using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using BoonBuilder.Models;

namespace BoonBuilder.Data
{
    public class BoonBuilderContext : IdentityDbContext<ApplicationUser>
    {
        public BoonBuilderContext(DbContextOptions<BoonBuilderContext> options)
            : base(options) { }

        public DbSet<God> Gods { get; set; }
        public DbSet<Weapon> Weapons { get; set; }
        public DbSet<WeaponAspect> WeaponAspects { get; set; }
        public DbSet<Boon> Boons { get; set; }
        public DbSet<DuoBoon> DuoBoons { get; set; }
        public DbSet<BoonRarityValue> BoonRarityValues { get; set; }
        public DbSet<BoonPrerequisite> BoonPrerequisites { get; set; }
        public DbSet<Build> Builds { get; set; }
        public DbSet<BuildBoon> BuildBoons { get; set; }
        public DbSet<UserFavorite> UserFavorites { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure DuoBoon inheritance
            modelBuilder.Entity<DuoBoon>()
                .HasBaseType<Boon>();

            // Configure DuoBoon relationships
            modelBuilder.Entity<DuoBoon>()
                .HasOne(d => d.FirstGod)
                .WithMany(g => g.PrimaryDuoBoons)
                .HasForeignKey(d => d.FirstGodId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DuoBoon>()
                .HasOne(d => d.SecondGod)
                .WithMany(g => g.SecondaryDuoBoons)
                .HasForeignKey(d => d.SecondGodId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure primary keys
            modelBuilder.Entity<BoonPrerequisite>()
                .HasKey(bp => bp.PrerequisiteId);

            modelBuilder.Entity<BoonRarityValue>()
                .HasKey(brv => brv.RarityValueId);

            modelBuilder.Entity<BuildBoon>()
                .HasKey(bb => bb.BuildBoonId);

            modelBuilder.Entity<UserFavorite>()
                .HasKey(uf => uf.FavoriteId);

            modelBuilder.Entity<WeaponAspect>()
                .HasKey(wa => wa.AspectId);

            modelBuilder.Entity<BoonPrerequisite>()
                .HasOne(bp => bp.Boon)
                .WithMany(b => b.Prerequisites)
                .HasForeignKey(bp => bp.BoonId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BoonPrerequisite>()
                .HasOne(bp => bp.RequiredBoon)
                .WithMany(b => b.RequiredFor)
                .HasForeignKey(bp => bp.RequiredBoonId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Build relationships
            modelBuilder.Entity<Build>()
                .HasOne(b => b.Author)
                .WithMany(u => u.Builds)
                .HasForeignKey(b => b.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Build>()
                .HasOne(b => b.WeaponAspect)
                .WithMany(wa => wa.Builds)
                .HasForeignKey(b => b.WeaponAspectId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure UserFavorite relationships
            modelBuilder.Entity<UserFavorite>()
                .HasOne(uf => uf.User)
                .WithMany(u => u.Favorites)
                .HasForeignKey(uf => uf.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserFavorite>()
                .HasOne(uf => uf.Build)
                .WithMany(b => b.Favorites)
                .HasForeignKey(uf => uf.BuildId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure WeaponAspect relationship
            modelBuilder.Entity<WeaponAspect>()
                .HasOne(wa => wa.Weapon)
                .WithMany(w => w.Aspects)
                .HasForeignKey(wa => wa.WeaponId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes for performance
            modelBuilder.Entity<Boon>()
                .HasIndex(b => new { b.Type, b.GodId, b.Slot });

            modelBuilder.Entity<Build>()
                .HasIndex(b => new { b.IsPublic, b.Tier, b.CreatedAt });

            modelBuilder.Entity<BoonPrerequisite>()
                .HasIndex(bp => bp.RequiredBoonId);

            // Configure string lengths to avoid warnings
            modelBuilder.Entity<God>(entity =>
            {
                entity.Property(e => e.Name).HasMaxLength(100);
                entity.Property(e => e.IconUrl).HasMaxLength(500);
                entity.Property(e => e.StatusEffect).HasMaxLength(50);
                entity.Property(e => e.Description).HasMaxLength(1000);
            });

            modelBuilder.Entity<Weapon>(entity =>
            {
                entity.Property(e => e.Name).HasMaxLength(100);
                entity.Property(e => e.IconUrl).HasMaxLength(500);
                entity.Property(e => e.Description).HasMaxLength(1000);
            });

            modelBuilder.Entity<WeaponAspect>(entity =>
            {
                entity.Property(e => e.Name).HasMaxLength(100);
                entity.Property(e => e.IconUrl).HasMaxLength(500);
                entity.Property(e => e.Description).HasMaxLength(1000);
            });

            modelBuilder.Entity<Boon>(entity =>
            {
                entity.Property(e => e.Name).HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.Effect).HasMaxLength(500);
                entity.Property(e => e.IconUrl).HasMaxLength(500);
                entity.Property(e => e.StatusEffect).HasMaxLength(50);
            });

            modelBuilder.Entity<Build>(entity =>
            {
                entity.Property(e => e.Name).HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(2000);
                entity.Property(e => e.PlaystyleTags).HasMaxLength(1000);
            });

            modelBuilder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(e => e.DisplayName).HasMaxLength(100);
            });
        }
    }
}