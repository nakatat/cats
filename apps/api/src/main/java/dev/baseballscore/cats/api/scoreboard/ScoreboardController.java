package dev.baseballscore.cats.api.scoreboard;

import dev.baseballscore.cats.api.scoreboard.dto.ScoreboardResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teams/{teamSlug}/games/{gameId}/scoreboard")
@Tag(name = "Scoreboards", description = "試合のイニングスコア")
public class ScoreboardController {

  private final ScoreboardService scoreboardService;

  public ScoreboardController(ScoreboardService scoreboardService) {
    this.scoreboardService = scoreboardService;
  }

  @GetMapping
  @Operation(
      summary = "イニングスコア取得",
      description =
          "指定した試合のイニングスコア登録状態と、チーム別のイニング得点・合計得点・安打・失策を返します。"
              + "未登録のイニングは配列に含まれず、攻撃しなかったイニングは not_batted として返します。")
  public ScoreboardResponse getScoreboard(
      @Parameter(description = "チームスラッグ", example = "cats") @PathVariable String teamSlug,
      @Parameter(description = "試合ID", example = "1") @PathVariable Long gameId) {
    return this.scoreboardService.getScoreboardByTeamSlugAndGameId(teamSlug, gameId);
  }
}
