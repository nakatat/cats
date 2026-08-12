package dev.baseballscore.cats.api.teamsummary;

import dev.baseballscore.cats.api.common.query.QueryLimit;
import dev.baseballscore.cats.api.teamsummary.dto.TeamSummaryResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teams/{teamSlug}/summary")
@Tag(name = "Team Summary", description = "トップページ向けの集約情報")
public class TeamSummaryController {

  private final TeamSummaryService teamSummaryService;

  public TeamSummaryController(TeamSummaryService teamSummaryService) {
    this.teamSummaryService = teamSummaryService;
  }

  @GetMapping
  @Operation(summary = "チーム集約情報取得", description = "チーム基本情報、対象シーズン、成績サマリー、最近の試合、今後の試合を返します。")
  public TeamSummaryResponse getSummary(
      @Parameter(description = "チームスラッグ", example = "cats") @PathVariable String teamSlug,
      @Parameter(description = "年度", example = "2024") @RequestParam(required = false)
          Integer seasonYear,
      @Parameter(description = "最近の試合件数", example = "5") @RequestParam(required = false)
          Integer recentLimit,
      @Parameter(description = "今後の試合件数", example = "5") @RequestParam(required = false)
          Integer upcomingLimit) {
    return this.teamSummaryService.getSummaryByTeamSlug(
        teamSlug,
        seasonYear,
        QueryLimit.normalize(recentLimit, "summary"),
        QueryLimit.normalize(upcomingLimit, "summary"));
  }
}
