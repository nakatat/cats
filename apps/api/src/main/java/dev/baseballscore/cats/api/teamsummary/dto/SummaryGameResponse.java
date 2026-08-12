package dev.baseballscore.cats.api.teamsummary.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.baseballscore.cats.api.teamsummary.mapper.model.SummaryGameRow;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalTime;

@Schema(name = "SummaryGameResponse", description = "試合要約情報")
public record SummaryGameResponse(
    @Schema(description = "試合ID", example = "10") Long gameId,
    @Schema(description = "試合日", example = "2024-10-20") LocalDate gameDate,
    @Schema(description = "開始時刻", example = "09:00") @JsonFormat(pattern = "HH:mm")
        LocalTime startTime,
    @Schema(description = "対戦相手名", example = "札幌ベアーズ") String opponentName,
    @Schema(description = "試合状態", example = "completed") String status,
    @Schema(description = "試合結果") String result,
    @Schema(description = "得点") Integer runsFor,
    @Schema(description = "失点") Integer runsAgainst,
    @Schema(description = "大会ID") Long tournamentId,
    @Schema(description = "大会名") String tournamentName,
    @Schema(description = "球場ID") Long stadiumId,
    @Schema(description = "球場名") String stadiumName,
    @Schema(description = "会場名") String venueName) {

  public static SummaryGameResponse from(SummaryGameRow summaryGameRow) {
    return new SummaryGameResponse(
        summaryGameRow.getGameId(),
        summaryGameRow.getGameDate(),
        summaryGameRow.getStartTime(),
        summaryGameRow.getOpponentName(),
        summaryGameRow.getStatus(),
        summaryGameRow.getResult(),
        summaryGameRow.getRunsFor(),
        summaryGameRow.getRunsAgainst(),
        summaryGameRow.getTournamentId(),
        summaryGameRow.getTournamentName(),
        summaryGameRow.getStadiumId(),
        summaryGameRow.getStadiumName(),
        summaryGameRow.getVenueName());
  }
}
