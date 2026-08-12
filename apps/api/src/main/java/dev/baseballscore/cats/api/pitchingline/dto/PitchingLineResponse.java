package dev.baseballscore.cats.api.pitchingline.dto;

import dev.baseballscore.cats.api.pitchingline.mapper.model.PitchingLineRow;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "PitchingLineResponse", description = "試合ごとの投球成績")
public record PitchingLineResponse(
    @Schema(description = "投球成績ID", example = "1") Long pitchingLineId,
    @Schema(description = "試合参加者ID", example = "1") Long gameParticipantId,
    @Schema(description = "試合ID", example = "1") Long gameId,
    @Schema(description = "選手ID") Long playerId,
    @Schema(description = "表示名", example = "山田 太郎") String displayName,
    @Schema(description = "背番号", example = "18") String uniformNumber,
    @Schema(description = "投球順", example = "1") Integer pitchingOrder,
    @Schema(description = "助っ人かどうか", example = "false") boolean guest,
    @Schema(description = "取ったアウト数", example = "15") Integer outsPitched,
    @Schema(description = "対戦打者数", example = "22") Integer battersFaced,
    @Schema(description = "投球数", example = "78") Integer pitches,
    @Schema(description = "被安打", example = "4") Integer hitsAllowed,
    @Schema(description = "被本塁打", example = "0") Integer homeRunsAllowed,
    @Schema(description = "失点", example = "2") Integer runsAllowed,
    @Schema(description = "自責点", example = "1") Integer earnedRuns,
    @Schema(description = "四球", example = "2") Integer walks,
    @Schema(description = "死球", example = "0") Integer hitByPitch,
    @Schema(description = "奪三振", example = "5") Integer strikeouts,
    @Schema(description = "勝利投手かどうか", example = "1") Integer wins,
    @Schema(description = "敗戦投手かどうか", example = "0") Integer losses,
    @Schema(description = "セーブかどうか", example = "0") Integer saves,
    @Schema(description = "ホールドかどうか", example = "0") Integer holds) {

  public static PitchingLineResponse from(PitchingLineRow pitchingLineRow) {
    return new PitchingLineResponse(
        pitchingLineRow.getPitchingLineId(),
        pitchingLineRow.getGameParticipantId(),
        pitchingLineRow.getGameId(),
        pitchingLineRow.getPlayerId(),
        pitchingLineRow.getDisplayName(),
        pitchingLineRow.getUniformNumber(),
        pitchingLineRow.getPitchingOrder(),
        pitchingLineRow.isGuest(),
        pitchingLineRow.getOutsPitched(),
        pitchingLineRow.getBattersFaced(),
        pitchingLineRow.getPitches(),
        pitchingLineRow.getHitsAllowed(),
        pitchingLineRow.getHomeRunsAllowed(),
        pitchingLineRow.getRunsAllowed(),
        pitchingLineRow.getEarnedRuns(),
        pitchingLineRow.getWalks(),
        pitchingLineRow.getHitByPitch(),
        pitchingLineRow.getStrikeouts(),
        pitchingLineRow.getWins(),
        pitchingLineRow.getLosses(),
        pitchingLineRow.getSaves(),
        pitchingLineRow.getHolds());
  }
}
