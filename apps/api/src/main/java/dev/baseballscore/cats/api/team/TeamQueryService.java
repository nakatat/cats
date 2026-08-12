package dev.baseballscore.cats.api.team;

import dev.baseballscore.cats.api.team.mapper.TeamMapper;
import dev.baseballscore.cats.api.team.mapper.model.TeamRow;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TeamQueryService {

  private final TeamMapper teamMapper;

  public TeamQueryService(TeamMapper teamMapper) {
    this.teamMapper = teamMapper;
  }

  @Transactional(readOnly = true)
  public TeamRow getActiveTeamBySlug(String teamSlug) {
    var teamRow = this.teamMapper.findActiveTeamBySlug(teamSlug);
    if (teamRow == null) {
      throw new TeamNotFoundException(teamSlug);
    }
    return teamRow;
  }
}
