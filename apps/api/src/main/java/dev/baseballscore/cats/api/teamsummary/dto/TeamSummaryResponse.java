package dev.baseballscore.cats.api.teamsummary.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(name = "TeamSummaryResponse", description = "チーム集約情報")
public record TeamSummaryResponse(
    @Schema(description = "チーム情報") SummaryTeamResponse team,
    @Schema(description = "対象シーズン情報") SummarySeasonResponse season,
    @Schema(description = "成績サマリー") SummaryRecordResponse record,
    @Schema(description = "最近の試合一覧") List<SummaryGameResponse> recentGames,
    @Schema(description = "今後の試合一覧") List<SummaryGameResponse> upcomingGames) {}
