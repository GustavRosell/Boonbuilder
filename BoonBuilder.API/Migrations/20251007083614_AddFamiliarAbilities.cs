using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BoonBuilder.API.Migrations
{
    /// <inheritdoc />
    public partial class AddFamiliarAbilities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Builds_Familiars_FamiliarId",
                table: "Builds");

            migrationBuilder.AddColumn<int>(
                name: "FamiliarAbilityId",
                table: "Builds",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FamiliarAbilities",
                columns: table => new
                {
                    AbilityId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FamiliarId = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    IconUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false),
                    IsHidden = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamiliarAbilities", x => x.AbilityId);
                    table.ForeignKey(
                        name: "FK_FamiliarAbilities_Familiars_FamiliarId",
                        column: x => x.FamiliarId,
                        principalTable: "Familiars",
                        principalColumn: "FamiliarId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Builds_FamiliarAbilityId",
                table: "Builds",
                column: "FamiliarAbilityId");

            migrationBuilder.CreateIndex(
                name: "IX_FamiliarAbilities_FamiliarId",
                table: "FamiliarAbilities",
                column: "FamiliarId");

            migrationBuilder.AddForeignKey(
                name: "FK_Builds_FamiliarAbilities_FamiliarAbilityId",
                table: "Builds",
                column: "FamiliarAbilityId",
                principalTable: "FamiliarAbilities",
                principalColumn: "AbilityId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Builds_Familiars_FamiliarId",
                table: "Builds",
                column: "FamiliarId",
                principalTable: "Familiars",
                principalColumn: "FamiliarId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Builds_FamiliarAbilities_FamiliarAbilityId",
                table: "Builds");

            migrationBuilder.DropForeignKey(
                name: "FK_Builds_Familiars_FamiliarId",
                table: "Builds");

            migrationBuilder.DropTable(
                name: "FamiliarAbilities");

            migrationBuilder.DropIndex(
                name: "IX_Builds_FamiliarAbilityId",
                table: "Builds");

            migrationBuilder.DropColumn(
                name: "FamiliarAbilityId",
                table: "Builds");

            migrationBuilder.AddForeignKey(
                name: "FK_Builds_Familiars_FamiliarId",
                table: "Builds",
                column: "FamiliarId",
                principalTable: "Familiars",
                principalColumn: "FamiliarId",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
