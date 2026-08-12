package dev.baseballscore.cats.api.team.dto;

import dev.baseballscore.cats.api.team.mapper.model.SeasonRow;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(name = "SeasonResponse", description = "シーズン情報")
public record SeasonResponse(
    @Schema(description = "シーズンID", example = "1") Long id,
    @Schema(description = "年度", example = "2024") Integer year,
    @Schema(description = "シーズン名", example = "2024年度") String name,
    @Schema(description = "開始日", example = "2024-01-01") LocalDate startDate,
    @Schema(description = "終了日", example = "2024-12-31") LocalDate endDate,
    @Schema(description = "現在のシーズンかどうか", example = "true") boolean isCurrent) {
  public static SeasonResponse from(SeasonRow seasonRow) {
    return new SeasonResponse(
        seasonRow.getId(),
        seasonRow.getYear(),
        seasonRow.getName(),
        seasonRow.getStartDate(),
        seasonRow.getEndDate(),
        seasonRow.isCurrent());
  }
}
