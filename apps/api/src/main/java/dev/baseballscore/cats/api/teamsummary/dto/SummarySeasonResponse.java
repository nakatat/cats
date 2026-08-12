package dev.baseballscore.cats.api.teamsummary.dto;

import dev.baseballscore.cats.api.team.mapper.model.SeasonRow;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(name = "SummarySeasonResponse", description = "対象シーズン情報")
public record SummarySeasonResponse(
    @Schema(description = "シーズンID", example = "1") Long id,
    @Schema(description = "年度", example = "2024") Integer year,
    @Schema(description = "シーズン名", example = "2024年度") String name,
    @Schema(description = "開始日", example = "2024-04-01") LocalDate startDate,
    @Schema(description = "終了日", example = "2024-11-30") LocalDate endDate,
    @Schema(description = "現在のシーズンかどうか", example = "true") boolean current) {

  public static SummarySeasonResponse from(SeasonRow seasonRow) {
    return new SummarySeasonResponse(
        seasonRow.getId(),
        seasonRow.getYear(),
        seasonRow.getName(),
        seasonRow.getStartDate(),
        seasonRow.getEndDate(),
        seasonRow.isCurrent());
  }
}
