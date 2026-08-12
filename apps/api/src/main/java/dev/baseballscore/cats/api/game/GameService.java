package dev.baseballscore.cats.api.game;

import dev.baseballscore.cats.api.game.dto.GameResponse;
import dev.baseballscore.cats.api.game.mapper.GameMapper;
import dev.baseballscore.cats.api.team.TeamQueryService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GameService {

  private final TeamQueryService teamQueryService;
  private final GameMapper gameMapper;

  public GameService(TeamQueryService teamQueryService, GameMapper gameMapper) {
    this.teamQueryService = teamQueryService;
    this.gameMapper = gameMapper;
  }

  @Transactional(readOnly = true)
  public List<GameResponse> getGamesByTeamSlug(String teamSlug, Integer seasonYear, String status) {
    var teamRow = this.teamQueryService.getActiveTeamBySlug(teamSlug);
    return this.gameMapper.findGamesByTeamId(teamRow.getId(), seasonYear, status).stream()
        .map(GameResponse::from)
        .toList();
  }

  @Transactional(readOnly = true)
  public GameResponse getGameByTeamSlugAndGameId(String teamSlug, Long gameId) {
    var teamRow = this.teamQueryService.getActiveTeamBySlug(teamSlug);
    var gameRow = this.gameMapper.findGameByTeamIdAndGameId(teamRow.getId(), gameId);
    if (gameRow == null) {
      throw new GameNotFoundException(teamSlug, gameId);
    }
    return GameResponse.from(gameRow);
  }
}
