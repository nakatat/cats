package dev.baseballscore.cats.api.game.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.baseballscore.cats.api.game.mapper.model.GameRow;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalTime;

@Schema(name = "GameResponse", description = "試合情報")
public record GameResponse(
    @Schema(description = "試合ID", example = "1") Long gameId,
    @Schema(description = "シーズンID", example = "1") Long seasonId,
    @Schema(description = "年度", example = "2024") Integer seasonYear,
    @Schema(description = "大会ID") Long tournamentId,
    @Schema(description = "大会名") String tournamentName,
    @Schema(description = "球場ID") Long stadiumId,
    @Schema(description = "球場名") String stadiumName,
    @Schema(description = "試合日", example = "2024-05-12") LocalDate gameDate,
    @Schema(description = "開始時刻", example = "09:00") @JsonFormat(pattern = "HH:mm")
        LocalTime startTime,
    @Schema(description = "対戦相手名") String opponentName,
    @Schema(description = "ホーム/アウェイ区分") String homeAway,
    @Schema(description = "試合種別") String gameType,
    @Schema(description = "試合状態") String status,
    @Schema(description = "得点") Integer runsFor,
    @Schema(description = "失点") Integer runsAgainst,
    @Schema(description = "試合結果") String result,
    @Schema(description = "会場名") String venueName,
    @Schema(description = "備考") String note) {

  public static GameResponse from(GameRow gameRow) {
    return new GameResponse(
        gameRow.getId(),
        gameRow.getSeasonId(),
        gameRow.getSeasonYear(),
        gameRow.getTournamentId(),
        gameRow.getTournamentName(),
        gameRow.getStadiumId(),
        gameRow.getStadiumName(),
        gameRow.getGameDate(),
        gameRow.getStartTime(),
        gameRow.getOpponentName(),
        gameRow.getHomeAway(),
        gameRow.getGameType(),
        gameRow.getStatus(),
        gameRow.getRunsFor(),
        gameRow.getRunsAgainst(),
        gameRow.getResult(),
        gameRow.getVenueName(),
        gameRow.getNote());
  }
}
