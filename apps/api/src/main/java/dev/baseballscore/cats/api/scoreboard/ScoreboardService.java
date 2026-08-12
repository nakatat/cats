package dev.baseballscore.cats.api.scoreboard;

import dev.baseballscore.cats.api.game.GameQueryService;
import dev.baseballscore.cats.api.game.InningScoreStatus;
import dev.baseballscore.cats.api.scoreboard.dto.ScoreboardResponse;
import dev.baseballscore.cats.api.scoreboard.dto.ScoreboardRowResponse;
import dev.baseballscore.cats.api.scoreboard.mapper.ScoreboardMapper;
import dev.baseballscore.cats.api.scoreboard.mapper.model.ScoreboardRow;
import dev.baseballscore.cats.api.team.TeamQueryService;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScoreboardService {

  private final TeamQueryService teamQueryService;
  private final GameQueryService gameQueryService;
  private final ScoreboardMapper scoreboardMapper;

  public ScoreboardService(
      TeamQueryService teamQueryService,
      GameQueryService gameQueryService,
      ScoreboardMapper scoreboardMapper) {
    this.teamQueryService = teamQueryService;
    this.gameQueryService = gameQueryService;
    this.scoreboardMapper = scoreboardMapper;
  }

  @Transactional(readOnly = true)
  public ScoreboardResponse getScoreboardByTeamSlugAndGameId(String teamSlug, Long gameId) {
    var teamRow = this.teamQueryService.getActiveTeamBySlug(teamSlug);
    var gameRow = this.gameQueryService.getGameByTeamIdAndGameId(teamSlug, teamRow.getId(), gameId);

    var rows = this.scoreboardMapper.findScoreboardRowsByGameId(gameId);
    var status = InningScoreStatus.fromValue(gameRow.getInningScoreStatus());
    if (rows.isEmpty()) {
      return new ScoreboardResponse(status, List.of());
    }

    var sortedRows =
        rows.stream()
            .sorted(
                Comparator.comparing(
                        (ScoreboardRow row) -> row.getDisplayOrder(),
                        Comparator.nullsLast(Comparator.<Integer>naturalOrder()))
                    .thenComparing((ScoreboardRow row) -> row.getScoreLineId()))
            .toList();

    Map<Long, List<ScoreboardRow>> rowsByScoreLineId = new LinkedHashMap<>();
    for (var row : sortedRows) {
      rowsByScoreLineId
          .computeIfAbsent(row.getScoreLineId(), ignored -> new ArrayList<>())
          .add(row);
    }

    var responseRows =
        rowsByScoreLineId.values().stream().map(ScoreboardRowResponse::from).toList();
    return new ScoreboardResponse(status, responseRows);
  }
}
