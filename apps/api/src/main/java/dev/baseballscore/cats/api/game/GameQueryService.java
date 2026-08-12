package dev.baseballscore.cats.api.game;

import dev.baseballscore.cats.api.game.mapper.GameMapper;
import dev.baseballscore.cats.api.game.mapper.model.GameRow;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GameQueryService {

  private final GameMapper gameMapper;

  public GameQueryService(GameMapper gameMapper) {
    this.gameMapper = gameMapper;
  }

  @Transactional(readOnly = true)
  public GameRow getGameByTeamIdAndGameId(String teamSlug, Long teamId, Long gameId) {
    var gameRow = this.gameMapper.findGameByTeamIdAndGameId(teamId, gameId);
    if (gameRow == null) {
      throw new GameNotFoundException(teamSlug, gameId);
    }
    return gameRow;
  }
}
