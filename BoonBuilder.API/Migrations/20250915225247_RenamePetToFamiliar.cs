using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BoonBuilder.API.Migrations
{
    /// <inheritdoc />
    public partial class RenamePetToFamiliar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Builds_Pets_PetId",
                table: "Builds");

            migrationBuilder.DropTable(
                name: "Pets");

            migrationBuilder.RenameColumn(
                name: "PetId",
                table: "Builds",
                newName: "FamiliarId");

            migrationBuilder.RenameIndex(
                name: "IX_Builds_PetId",
                table: "Builds",
                newName: "IX_Builds_FamiliarId");

            migrationBuilder.CreateTable(
                name: "Familiars",
                columns: table => new
                {
                    FamiliarId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    IconUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false),
                    IsHidden = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Familiars", x => x.FamiliarId);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Builds_Familiars_FamiliarId",
                table: "Builds",
                column: "FamiliarId",
                principalTable: "Familiars",
                principalColumn: "FamiliarId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Builds_Familiars_FamiliarId",
                table: "Builds");

            migrationBuilder.DropTable(
                name: "Familiars");

            migrationBuilder.RenameColumn(
                name: "FamiliarId",
                table: "Builds",
                newName: "PetId");

            migrationBuilder.RenameIndex(
                name: "IX_Builds_FamiliarId",
                table: "Builds",
                newName: "IX_Builds_PetId");

            migrationBuilder.CreateTable(
                name: "Pets",
                columns: table => new
                {
                    PetId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Description = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false),
                    IconUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    IsHidden = table.Column<bool>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pets", x => x.PetId);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Builds_Pets_PetId",
                table: "Builds",
                column: "PetId",
                principalTable: "Pets",
                principalColumn: "PetId",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
