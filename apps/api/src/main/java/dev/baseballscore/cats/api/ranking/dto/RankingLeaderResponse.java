package dev.baseballscore.cats.api.ranking.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(name = "RankingLeaderResponse", description = "ランキング上位選手")
public record RankingLeaderResponse(
    @Schema(description = "順位", example = "1") Integer rank,
    @Schema(description = "選手ID", example = "1") Long playerId,
    @Schema(description = "表示名", example = "山田 太郎") String displayName,
    @Schema(description = "プロフィール画像URL") String profileImageUrl,
    @Schema(description = "背番号", example = "7") Integer uniformNumber,
    @Schema(description = "助っ人かどうか", example = "false") boolean guest,
    @Schema(description = "表示値", example = "0.400") String value,
    @Schema(description = "比較用の生値", example = "0.4") BigDecimal rawValue,
    @Schema(description = "規定打席または規定投球回到達者かどうか", example = "true") Boolean qualified) {}
