package dev.baseballscore.cats.api.battingline;

import dev.baseballscore.cats.api.battingline.dto.BattingLineResponse;
import dev.baseballscore.cats.api.battingline.mapper.BattingLineMapper;
import dev.baseballscore.cats.api.game.GameQueryService;
import dev.baseballscore.cats.api.team.TeamQueryService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BattingLineService {

  private final TeamQueryService teamQueryService;
  private final GameQueryService gameQueryService;
  private final BattingLineMapper battingLineMapper;

  public BattingLineService(
      TeamQueryService teamQueryService,
      GameQueryService gameQueryService,
      BattingLineMapper battingLineMapper) {
    this.teamQueryService = teamQueryService;
    this.gameQueryService = gameQueryService;
    this.battingLineMapper = battingLineMapper;
  }

  @Transactional(readOnly = true)
  public List<BattingLineResponse> getBattingLinesByTeamSlugAndGameId(
      String teamSlug, Long gameId) {
    var teamRow = this.teamQueryService.getActiveTeamBySlug(teamSlug);
    this.gameQueryService.getGameByTeamIdAndGameId(teamSlug, teamRow.getId(), gameId);

    return this.battingLineMapper
        .findBattingLinesByGameIdAndTeamId(teamRow.getId(), gameId)
        .stream()
        .map(BattingLineResponse::from)
        .toList();
  }
}
