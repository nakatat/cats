package dev.baseballscore.cats.api.stats.batting;

import dev.baseballscore.cats.api.game.GameStatus;
import dev.baseballscore.cats.api.stats.batting.dto.BattingStatsResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teams/{teamSlug}/stats/batting")
@Tag(name = "Batting Stats", description = "選手別打撃成績")
public class BattingStatsController {

  private final BattingStatsService battingStatsService;

  public BattingStatsController(BattingStatsService battingStatsService) {
    this.battingStatsService = battingStatsService;
  }

  @GetMapping
  @Operation(summary = "打撃成績一覧取得", description = "チーム内の選手別打撃成績を返します。年度、大会、試合状態、助っ人の含有を絞り込めます。")
  public List<BattingStatsResponse> getBattingStats(
      @Parameter(description = "チームスラッグ", example = "cats") @PathVariable String teamSlug,
      @Parameter(description = "年度", example = "2024") @RequestParam(required = false)
          Integer seasonYear,
      @Parameter(description = "大会ID", example = "1") @RequestParam(required = false)
          Long tournamentId,
      @Parameter(
              description = "試合状態",
              example = "completed",
              schema =
                  @Schema(allowableValues = {"scheduled", "completed", "cancelled", "postponed"}))
          @RequestParam(required = false)
          String status,
      @Parameter(description = "助っ人を含めるかどうか", example = "false") @RequestParam(required = false)
          Boolean includeGuests,
      @Parameter(
              description = "並び順キー",
              example = "battingAverage",
              schema =
                  @Schema(
                      allowableValues = {
                        "battingAverage",
                        "hits",
                        "homeRuns",
                        "runsBattedIn",
                        "ops",
                        "games"
                      }))
          @RequestParam(required = false)
          String sort) {
    var gameStatus = GameStatus.fromValue(status);
    var battingStatsSort = BattingStatsSort.fromValue(sort);
    return this.battingStatsService.getBattingStatsByTeamSlug(
        teamSlug, seasonYear, tournamentId, gameStatus, includeGuests, battingStatsSort);
  }
}
