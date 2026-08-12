package dev.baseballscore.cats.api.ranking.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(name = "RankingGroupResponse", description = "ランキングカテゴリ別グループ")
public record RankingGroupResponse(
    @Schema(description = "カテゴリ", example = "battingAverage") String category,
    @Schema(description = "カテゴリ名", example = "打率") String label,
    @Schema(description = "上位一覧") List<RankingLeaderResponse> leaders) {}
