using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BoonBuilder.API.Migrations
{
    /// <inheritdoc />
    public partial class AddInfusionToGods : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "InfusionIconUrl",
                table: "Gods",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InfusionIconUrl",
                table: "Gods");
        }
    }
}
