package dev.baseballscore.cats.api.battingline;

import dev.baseballscore.cats.api.battingline.dto.BattingLineResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teams/{teamSlug}/games/{gameId}/batting-lines")
@Tag(name = "BattingLines", description = "試合ごとの打撃成績")
public class BattingLineController {

  private final BattingLineService battingLineService;

  public BattingLineController(BattingLineService battingLineService) {
    this.battingLineService = battingLineService;
  }

  @GetMapping
  @Operation(
      summary = "試合ごとの打撃成績一覧取得",
      description = "指定した試合の選手別打撃成績を返します。助っ人も `playerId = null` のまま返します。")
  public List<BattingLineResponse> getBattingLines(
      @Parameter(description = "チームスラッグ", example = "cats") @PathVariable String teamSlug,
      @Parameter(description = "試合ID", example = "1") @PathVariable Long gameId) {
    return this.battingLineService.getBattingLinesByTeamSlugAndGameId(teamSlug, gameId);
  }
}
