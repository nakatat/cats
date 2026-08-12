package dev.baseballscore.cats.api.battingline.dto;

import dev.baseballscore.cats.api.battingline.mapper.model.BattingLineRow;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "BattingLineResponse", description = "試合ごとの打撃成績")
public record BattingLineResponse(
    @Schema(description = "打撃成績ID", example = "1") Long battingLineId,
    @Schema(description = "試合参加者ID", example = "1") Long gameParticipantId,
    @Schema(description = "試合ID", example = "1") Long gameId,
    @Schema(description = "選手ID") Long playerId,
    @Schema(description = "表示名", example = "山田 太郎") String displayName,
    @Schema(description = "背番号", example = "7") String uniformNumber,
    @Schema(description = "打順", example = "1") Integer battingOrder,
    @Schema(description = "守備位置", example = "遊撃手") String position,
    @Schema(description = "助っ人かどうか", example = "false") boolean guest,
    @Schema(description = "打席数", example = "4") Integer plateAppearances,
    @Schema(description = "打数", example = "4") Integer atBats,
    @Schema(description = "安打", example = "2") Integer hits,
    @Schema(description = "二塁打", example = "1") Integer doubles,
    @Schema(description = "三塁打", example = "0") Integer triples,
    @Schema(description = "本塁打", example = "0") Integer homeRuns,
    @Schema(description = "打点", example = "1") Integer runsBattedIn,
    @Schema(description = "得点", example = "1") Integer runs,
    @Schema(description = "四球", example = "0") Integer walks,
    @Schema(description = "死球", example = "0") Integer hitByPitch,
    @Schema(description = "三振", example = "1") Integer strikeouts,
    @Schema(description = "盗塁", example = "1") Integer stolenBases,
    @Schema(description = "犠打", example = "0") Integer sacrificeHits,
    @Schema(description = "犠飛", example = "0") Integer sacrificeFlies,
    @Schema(description = "盗塁死", example = "0") Integer caughtStealing,
    @Schema(description = "敵失出塁", example = "0") Integer reachedOnErrors) {

  public static BattingLineResponse from(BattingLineRow battingLineRow) {
    return new BattingLineResponse(
        battingLineRow.getBattingLineId(),
        battingLineRow.getGameParticipantId(),
        battingLineRow.getGameId(),
        battingLineRow.getPlayerId(),
        battingLineRow.getDisplayName(),
        battingLineRow.getUniformNumber(),
        battingLineRow.getBattingOrder(),
        battingLineRow.getPosition(),
        battingLineRow.isGuest(),
        battingLineRow.getPlateAppearances(),
        battingLineRow.getAtBats(),
        battingLineRow.getHits(),
        battingLineRow.getDoubles(),
        battingLineRow.getTriples(),
        battingLineRow.getHomeRuns(),
        battingLineRow.getRunsBattedIn(),
        battingLineRow.getRuns(),
        battingLineRow.getWalks(),
        battingLineRow.getHitByPitch(),
        battingLineRow.getStrikeouts(),
        battingLineRow.getStolenBases(),
        battingLineRow.getSacrificeHits(),
        battingLineRow.getSacrificeFlies(),
        battingLineRow.getCaughtStealing(),
        battingLineRow.getReachedOnErrors());
  }
}
