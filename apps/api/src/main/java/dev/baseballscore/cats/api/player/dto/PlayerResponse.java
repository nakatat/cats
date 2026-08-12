package dev.baseballscore.cats.api.player.dto;

import dev.baseballscore.cats.api.player.mapper.model.PlayerRow;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(name = "PlayerResponse", description = "選手情報")
public record PlayerResponse(
    @Schema(description = "選手ID", example = "1") Long playerId,
    @Schema(description = "選手名", example = "山田 太郎") String name,
    @Schema(description = "ふりがな", example = "やまだ たろう") String kana,
    @Schema(description = "背番号", example = "7") String uniformNumber,
    @Schema(description = "主な守備位置", example = "内野手") String primaryPosition,
    @Schema(description = "投", example = "右") String throwingHand,
    @Schema(description = "打", example = "右") String battingHand,
    @Schema(description = "加入日", example = "2020-04-01") LocalDate joinedAt,
    @Schema(description = "退団日") LocalDate leftAt,
    @Schema(description = "プロフィール画像URL") String profileImageUrl,
    @Schema(description = "紹介文") String description) {
  public static PlayerResponse from(PlayerRow playerRow) {
    return new PlayerResponse(
        playerRow.getId(),
        playerRow.getName(),
        playerRow.getKana(),
        playerRow.getUniformNumber(),
        playerRow.getPrimaryPosition(),
        playerRow.getThrowingHand(),
        playerRow.getBattingHand(),
        playerRow.getJoinedAt(),
        playerRow.getLeftAt(),
        playerRow.getProfileImageUrl(),
        playerRow.getDescription());
  }
}
