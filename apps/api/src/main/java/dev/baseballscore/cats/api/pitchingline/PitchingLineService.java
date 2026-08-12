package dev.baseballscore.cats.api.pitchingline;

import dev.baseballscore.cats.api.game.GameQueryService;
import dev.baseballscore.cats.api.pitchingline.dto.PitchingLineResponse;
import dev.baseballscore.cats.api.pitchingline.mapper.PitchingLineMapper;
import dev.baseballscore.cats.api.team.TeamQueryService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PitchingLineService {

  private final TeamQueryService teamQueryService;
  private final GameQueryService gameQueryService;
  private final PitchingLineMapper pitchingLineMapper;

  public PitchingLineService(
      TeamQueryService teamQueryService,
      GameQueryService gameQueryService,
      PitchingLineMapper pitchingLineMapper) {
    this.teamQueryService = teamQueryService;
    this.gameQueryService = gameQueryService;
    this.pitchingLineMapper = pitchingLineMapper;
  }

  @Transactional(readOnly = true)
  public List<PitchingLineResponse> getPitchingLinesByTeamSlugAndGameId(
      String teamSlug, Long gameId) {
    var teamRow = this.teamQueryService.getActiveTeamBySlug(teamSlug);
    var gameRow = this.gameQueryService.getGameByTeamIdAndGameId(teamSlug, teamRow.getId(), gameId);

    return this.pitchingLineMapper
        .findPitchingLinesByGameIdAndTeamId(teamRow.getId(), gameRow.getId())
        .stream()
        .map(PitchingLineResponse::from)
        .toList();
  }
}
