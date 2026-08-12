package dev.baseballscore.cats.api.team;

import dev.baseballscore.cats.api.team.dto.SeasonResponse;
import dev.baseballscore.cats.api.team.dto.TeamResponse;
import dev.baseballscore.cats.api.team.mapper.TeamMapper;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TeamService {

  private final TeamQueryService teamQueryService;
  private final TeamMapper teamMapper;

  public TeamService(TeamQueryService teamQueryService, TeamMapper teamMapper) {
    this.teamQueryService = teamQueryService;
    this.teamMapper = teamMapper;
  }

  @Transactional(readOnly = true)
  public TeamResponse getTeamBySlug(String slug) {
    var teamRow = this.teamQueryService.getActiveTeamBySlug(slug);
    return TeamResponse.from(teamRow);
  }

  @Transactional(readOnly = true)
  public List<SeasonResponse> getSeasonsByTeamSlug(String slug) {
    var teamRow = this.teamQueryService.getActiveTeamBySlug(slug);

    return this.teamMapper.findSeasonsByTeamId(teamRow.getId()).stream()
        .map(SeasonResponse::from)
        .toList();
  }
}
