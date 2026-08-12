package dev.baseballscore.cats.api.gameparticipant.dto;

import dev.baseballscore.cats.api.gameparticipant.mapper.model.GameParticipantRow;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "GameParticipantResponse", description = "試合参加者情報")
public record GameParticipantResponse(
    @Schema(description = "試合参加者ID", example = "1") Long gameParticipantId,
    @Schema(description = "試合ID", example = "1") Long gameId,
    @Schema(description = "選手ID") Long playerId,
    @Schema(description = "表示名", example = "山田 太郎") String displayName,
    @Schema(description = "背番号", example = "7") String uniformNumber,
    @Schema(description = "打順", example = "1") Integer battingOrder,
    @Schema(description = "守備位置", example = "遊撃手") String position,
    @Schema(description = "先発かどうか", example = "true") boolean starter,
    @Schema(description = "助っ人かどうか", example = "false") boolean guest) {

  public static GameParticipantResponse from(GameParticipantRow gameParticipantRow) {
    return new GameParticipantResponse(
        gameParticipantRow.getGameParticipantId(),
        gameParticipantRow.getGameId(),
        gameParticipantRow.getPlayerId(),
        gameParticipantRow.getDisplayName(),
        gameParticipantRow.getUniformNumber(),
        gameParticipantRow.getBattingOrder(),
        gameParticipantRow.getPosition(),
        gameParticipantRow.isStarter(),
        gameParticipantRow.isGuest());
  }
}
