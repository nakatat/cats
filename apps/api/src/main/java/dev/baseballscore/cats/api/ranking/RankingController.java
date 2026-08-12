package dev.baseballscore.cats.api.ranking;

import dev.baseballscore.cats.api.common.query.QueryLimit;
import dev.baseballscore.cats.api.game.GameStatus;
import dev.baseballscore.cats.api.ranking.dto.RankingResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teams/{teamSlug}/rankings")
@Tag(name = "Rankings", description = "ランキング")
public class RankingController {

  private final RankingService rankingService;

  public RankingController(RankingService rankingService) {
    this.rankingService = rankingService;
  }

  @GetMapping
  @Operation(
      summary = "ランキング一覧取得",
      description = "チーム内の主要指標ランキングを返します。年度、大会、試合状態、助っ人の含有、規定打席または規定投球回到達者の限定、件数、カテゴリを絞り込めます。")
  public RankingResponse getRankings(
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
      @Parameter(description = "規定打席または規定投球回到達者のみを対象にするか", example = "true")
          @RequestParam(required = false)
          Boolean qualifiedOnly,
      @Parameter(description = "1カテゴリあたりの件数", example = "5") @RequestParam(required = false)
          Integer limit,
      @Parameter(
              description = "カテゴリ",
              example = "hits",
              schema =
                  @Schema(
                      allowableValues = {
                        "battingAverage",
                        "hits",
                        "homeRuns",
                        "runsBattedIn",
                        "stolenBases",
                        "ops",
                        "earnedRunAverage",
                        "wins",
                        "strikeouts",
                        "saves",
                        "holds"
                      }))
          @RequestParam(required = false)
          String category) {
    var gameStatus = GameStatus.fromValue(status);
    var rankingCategory = RankingCategory.fromValue(category);
    var effectiveLimit = QueryLimit.normalize(limit, "ranking");
    return this.rankingService.getRankingsByTeamSlug(
        teamSlug,
        seasonYear,
        tournamentId,
        gameStatus,
        includeGuests,
        qualifiedOnly,
        rankingCategory,
        effectiveLimit);
  }
}
