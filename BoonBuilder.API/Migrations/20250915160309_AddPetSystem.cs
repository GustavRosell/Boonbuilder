using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BoonBuilder.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPetSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PetId",
                table: "Builds",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Pets",
                columns: table => new
                {
                    PetId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    IconUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false),
                    IsHidden = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pets", x => x.PetId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Builds_PetId",
                table: "Builds",
                column: "PetId");

            migrationBuilder.AddForeignKey(
                name: "FK_Builds_Pets_PetId",
                table: "Builds",
                column: "PetId",
                principalTable: "Pets",
                principalColumn: "PetId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Builds_Pets_PetId",
                table: "Builds");

            migrationBuilder.DropTable(
                name: "Pets");

            migrationBuilder.DropIndex(
                name: "IX_Builds_PetId",
                table: "Builds");

            migrationBuilder.DropColumn(
                name: "PetId",
                table: "Builds");
        }
    }
}
