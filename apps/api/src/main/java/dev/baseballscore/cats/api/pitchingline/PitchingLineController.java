package dev.baseballscore.cats.api.pitchingline;

import dev.baseballscore.cats.api.pitchingline.dto.PitchingLineResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teams/{teamSlug}/games/{gameId}/pitching-lines")
@Tag(name = "PitchingLines", description = "試合ごとの投球成績")
public class PitchingLineController {

  private final PitchingLineService pitchingLineService;

  public PitchingLineController(PitchingLineService pitchingLineService) {
    this.pitchingLineService = pitchingLineService;
  }

  @GetMapping
  @Operation(
      summary = "試合ごとの投球成績一覧取得",
      description = "指定した試合の投手別投球成績を返します。MVPでは試合ごとの合計のみを返し、1 球単位やイニング別履歴は扱いません。")
  public List<PitchingLineResponse> getPitchingLines(
      @Parameter(description = "チームスラッグ", example = "cats") @PathVariable String teamSlug,
      @Parameter(description = "試合ID", example = "1") @PathVariable Long gameId) {
    return this.pitchingLineService.getPitchingLinesByTeamSlugAndGameId(teamSlug, gameId);
  }
}
