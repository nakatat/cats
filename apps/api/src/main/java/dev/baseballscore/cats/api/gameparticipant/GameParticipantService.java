package dev.baseballscore.cats.api.gameparticipant;

import dev.baseballscore.cats.api.game.GameQueryService;
import dev.baseballscore.cats.api.gameparticipant.dto.GameParticipantResponse;
import dev.baseballscore.cats.api.gameparticipant.mapper.GameParticipantMapper;
import dev.baseballscore.cats.api.team.TeamQueryService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GameParticipantService {

  private final TeamQueryService teamQueryService;
  private final GameQueryService gameQueryService;
  private final GameParticipantMapper gameParticipantMapper;

  public GameParticipantService(
      TeamQueryService teamQueryService,
      GameQueryService gameQueryService,
      GameParticipantMapper gameParticipantMapper) {
    this.teamQueryService = teamQueryService;
    this.gameQueryService = gameQueryService;
    this.gameParticipantMapper = gameParticipantMapper;
  }

  @Transactional(readOnly = true)
  public List<GameParticipantResponse> getParticipantsByTeamSlugAndGameId(
      String teamSlug, Long gameId) {
    var teamRow = this.teamQueryService.getActiveTeamBySlug(teamSlug);
    this.gameQueryService.getGameByTeamIdAndGameId(teamSlug, teamRow.getId(), gameId);
    return this.gameParticipantMapper
        .findParticipantsByGameIdAndTeamId(teamRow.getId(), gameId)
        .stream()
        .map(GameParticipantResponse::from)
        .toList();
  }
}
