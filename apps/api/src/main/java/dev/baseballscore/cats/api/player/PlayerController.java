package dev.baseballscore.cats.api.player;

import dev.baseballscore.cats.api.player.dto.PlayerResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teams/{teamSlug}/players")
@Tag(name = "Players", description = "選手情報")
public class PlayerController {

  private final PlayerService playerService;

  public PlayerController(PlayerService playerService) {
    this.playerService = playerService;
  }

  @GetMapping
  @Operation(summary = "選手一覧取得", description = "チームに紐づく選手一覧を返します。active を指定すると現役/退団で絞り込めます。")
  public List<PlayerResponse> getPlayers(
      @Parameter(description = "チームスラッグ", example = "cats") @PathVariable String teamSlug,
      @Parameter(description = "現役選手のみ true、退団選手のみ false、未指定で全選手") @RequestParam(required = false)
          Boolean active) {
    return this.playerService.getPlayersByTeamSlug(teamSlug, active);
  }

  @GetMapping("/{playerId}")
  @Operation(summary = "選手詳細取得", description = "指定した選手IDの詳細を返します。")
  public PlayerResponse getPlayer(
      @Parameter(description = "チームスラッグ", example = "cats") @PathVariable String teamSlug,
      @Parameter(description = "選手ID", example = "1") @PathVariable Long playerId) {
    return this.playerService.getPlayerByTeamSlugAndPlayerId(teamSlug, playerId);
  }
}
