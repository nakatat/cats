package dev.baseballscore.cats.api.tournament;

import dev.baseballscore.cats.api.team.TeamQueryService;
import dev.baseballscore.cats.api.tournament.dto.TournamentResponse;
import dev.baseballscore.cats.api.tournament.mapper.TournamentMapper;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TournamentService {

  private final TeamQueryService teamQueryService;
  private final TournamentMapper tournamentMapper;

  public TournamentService(TeamQueryService teamQueryService, TournamentMapper tournamentMapper) {
    this.teamQueryService = teamQueryService;
    this.tournamentMapper = tournamentMapper;
  }

  @Transactional(readOnly = true)
  public List<TournamentResponse> getTournamentsByTeamSlug(String teamSlug) {
    var teamRow = this.teamQueryService.getActiveTeamBySlug(teamSlug);
    return this.tournamentMapper.findTournamentsByTeamId(teamRow.getId()).stream()
        .map(TournamentResponse::from)
        .toList();
  }

  @Transactional(readOnly = true)
  public TournamentResponse getTournamentByTeamSlugAndTournamentId(
      String teamSlug, Long tournamentId) {
    var teamRow = this.teamQueryService.getActiveTeamBySlug(teamSlug);
    var tournamentRow =
        this.tournamentMapper.findTournamentByTeamIdAndTournamentId(teamRow.getId(), tournamentId);
    if (tournamentRow == null) {
      throw new TournamentNotFoundException(teamSlug, tournamentId);
    }
    return TournamentResponse.from(tournamentRow);
  }
}
