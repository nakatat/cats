package dev.baseballscore.cats.api.player;

import dev.baseballscore.cats.api.player.dto.PlayerResponse;
import dev.baseballscore.cats.api.player.mapper.PlayerMapper;
import dev.baseballscore.cats.api.team.TeamQueryService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlayerService {

  private final TeamQueryService teamQueryService;
  private final PlayerMapper playerMapper;

  public PlayerService(TeamQueryService teamQueryService, PlayerMapper playerMapper) {
    this.teamQueryService = teamQueryService;
    this.playerMapper = playerMapper;
  }

  @Transactional(readOnly = true)
  public List<PlayerResponse> getPlayersByTeamSlug(String teamSlug, Boolean active) {
    var teamRow = this.teamQueryService.getActiveTeamBySlug(teamSlug);
    return this.playerMapper.findPlayersByTeamId(teamRow.getId(), active).stream()
        .map(PlayerResponse::from)
        .toList();
  }

  @Transactional(readOnly = true)
  public PlayerResponse getPlayerByTeamSlugAndPlayerId(String teamSlug, Long playerId) {
    var teamRow = this.teamQueryService.getActiveTeamBySlug(teamSlug);
    var playerRow = this.playerMapper.findPlayerByTeamIdAndPlayerId(teamRow.getId(), playerId);
    if (playerRow == null) {
      throw new PlayerNotFoundException(playerId);
    }
    return PlayerResponse.from(playerRow);
  }
}
