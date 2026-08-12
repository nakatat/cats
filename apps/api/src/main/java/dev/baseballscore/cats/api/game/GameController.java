package dev.baseballscore.cats.api.game;

import dev.baseballscore.cats.api.game.dto.GameResponse;
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
@RequestMapping("/teams/{teamSlug}/games")
@Tag(name = "Games", description = "試合予定・試合結果")
public class GameController {

  private final GameService gameService;

  public GameController(GameService gameService) {
    this.gameService = gameService;
  }

  @GetMapping
  @Operation(summary = "試合一覧取得", description = "チームに紐づく試合予定・試合結果の一覧を返します。")
  public List<GameResponse> getGames(
      @Parameter(description = "チームスラッグ", example = "cats") @PathVariable String teamSlug,
      @Parameter(description = "年度", example = "2024") @RequestParam(required = false)
          Integer seasonYear,
      @Parameter(
              description = "試合状態",
              example = "completed",
              schema =
                  @Schema(allowableValues = {"scheduled", "completed", "cancelled", "postponed"}))
          @RequestParam(required = false)
          String status) {
    var normalizedStatus = status == null ? null : GameStatus.fromValue(status).value();
    return this.gameService.getGamesByTeamSlug(teamSlug, seasonYear, normalizedStatus);
  }

  @GetMapping("/{gameId}")
  @Operation(summary = "試合詳細取得", description = "指定した試合IDの詳細を返します。")
  public GameResponse getGame(
      @Parameter(description = "チームスラッグ", example = "cats") @PathVariable String teamSlug,
      @Parameter(description = "試合ID", example = "1") @PathVariable Long gameId) {
    return this.gameService.getGameByTeamSlugAndGameId(teamSlug, gameId);
  }
}
