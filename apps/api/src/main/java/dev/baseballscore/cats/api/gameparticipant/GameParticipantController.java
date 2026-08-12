package dev.baseballscore.cats.api.gameparticipant;

import dev.baseballscore.cats.api.gameparticipant.dto.GameParticipantResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teams/{teamSlug}/games/{gameId}/participants")
@Tag(name = "Game Participants", description = "試合参加者情報")
public class GameParticipantController {

  private final GameParticipantService gameParticipantService;

  public GameParticipantController(GameParticipantService gameParticipantService) {
    this.gameParticipantService = gameParticipantService;
  }

  @GetMapping
  @Operation(summary = "試合参加者一覧取得", description = "指定した試合の参加者一覧を返します。")
  public List<GameParticipantResponse> getParticipants(
      @Parameter(description = "チームスラッグ", example = "cats") @PathVariable String teamSlug,
      @Parameter(description = "試合ID", example = "1") @PathVariable Long gameId) {
    return this.gameParticipantService.getParticipantsByTeamSlugAndGameId(teamSlug, gameId);
  }
}
