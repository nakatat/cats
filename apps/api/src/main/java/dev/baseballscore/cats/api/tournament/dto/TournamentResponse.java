package dev.baseballscore.cats.api.tournament.dto;

import dev.baseballscore.cats.api.tournament.mapper.model.TournamentRow;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "TournamentResponse", description = "大会情報")
public record TournamentResponse(
    @Schema(description = "大会ID", example = "1") Long tournamentId,
    @Schema(description = "大会名", example = "札幌ベースボールリーグ") String name,
    @Schema(description = "短い表示名", example = "SBL") String shortName,
    @Schema(description = "対象年度", example = "2024") Integer seasonYear,
    @Schema(description = "大会説明", example = "札幌市内の草野球リーグです。") String description,
    @Schema(description = "表示順", example = "1") Integer displayOrder) {

  public static TournamentResponse from(TournamentRow tournamentRow) {
    return new TournamentResponse(
        tournamentRow.getId(),
        tournamentRow.getName(),
        tournamentRow.getShortName(),
        tournamentRow.getSeasonYear(),
        tournamentRow.getDescription(),
        tournamentRow.getDisplayOrder());
  }
}
