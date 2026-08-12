package dev.baseballscore.cats.api.teamsummary;

import dev.baseballscore.cats.api.common.query.QueryLimit;
import dev.baseballscore.cats.api.team.SeasonNotFoundException;
import dev.baseballscore.cats.api.team.TeamQueryService;
import dev.baseballscore.cats.api.team.mapper.model.SeasonRow;
import dev.baseballscore.cats.api.teamsummary.dto.SummaryGameResponse;
import dev.baseballscore.cats.api.teamsummary.dto.SummaryRecordResponse;
import dev.baseballscore.cats.api.teamsummary.dto.SummarySeasonResponse;
import dev.baseballscore.cats.api.teamsummary.dto.SummaryTeamResponse;
import dev.baseballscore.cats.api.teamsummary.dto.TeamSummaryResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TeamSummaryService {

  private final TeamQueryService teamQueryService;
  private final TeamSummaryMapper teamSummaryMapper;

  public TeamSummaryService(
      TeamQueryService teamQueryService, TeamSummaryMapper teamSummaryMapper) {
    this.teamQueryService = teamQueryService;
    this.teamSummaryMapper = teamSummaryMapper;
  }

  /**
   * チームのシーズン、成績、最近の試合、今後の試合をまとめて取得する。
   *
   * <p>seasonYearが未指定の場合はcurrent season、なければ最新seasonを使用する。
   * recentLimitとupcomingLimitはQueryLimitで個別に正規化する。
   *
   * @param teamSlug 対象チームのslug
   * @param seasonYear 対象年度。nullの場合は自動解決
   * @param recentLimit 最近の試合の最大件数
   * @param upcomingLimit 今後の試合の最大件数
   * @return トップページ向けのチームサマリー
   */
  @Transactional(readOnly = true)
  public TeamSummaryResponse getSummaryByTeamSlug(
      String teamSlug, Integer seasonYear, Integer recentLimit, Integer upcomingLimit) {
    var effectiveRecentLimit = QueryLimit.normalize(recentLimit, "summary");
    var effectiveUpcomingLimit = QueryLimit.normalize(upcomingLimit, "summary");
    var teamRow = this.teamQueryService.getActiveTeamBySlug(teamSlug);
    var seasonRow = this.resolveSeason(teamSlug, teamRow.getId(), seasonYear);
    var recordRow =
        seasonYear == null
            ? this.teamSummaryMapper.findSummaryRecordByTeamId(teamRow.getId())
            : this.teamSummaryMapper.findSummaryRecordBySeasonId(seasonRow.getId());
    var recentGames =
        this.teamSummaryMapper.findRecentGamesBySeasonId(seasonRow.getId(), effectiveRecentLimit);
    var upcomingGames =
        this.teamSummaryMapper.findUpcomingGamesBySeasonId(
            seasonRow.getId(), effectiveUpcomingLimit);

    return new TeamSummaryResponse(
        SummaryTeamResponse.from(teamRow),
        SummarySeasonResponse.from(seasonRow),
        SummaryRecordResponse.from(recordRow),
        recentGames.stream().map(SummaryGameResponse::from).toList(),
        upcomingGames.stream().map(SummaryGameResponse::from).toList());
  }

  private SeasonRow resolveSeason(String teamSlug, Long teamId, Integer seasonYear) {
    if (seasonYear != null) {
      var seasonRow = this.teamSummaryMapper.findSeasonByTeamIdAndYear(teamId, seasonYear);
      if (seasonRow == null) {
        throw new SeasonNotFoundException(teamSlug, seasonYear);
      }
      return seasonRow;
    }

    var currentSeasonRow = this.teamSummaryMapper.findCurrentSeasonByTeamId(teamId);
    if (currentSeasonRow != null) {
      return currentSeasonRow;
    }

    var latestSeasonRow = this.teamSummaryMapper.findLatestSeasonByTeamId(teamId);
    if (latestSeasonRow != null) {
      return latestSeasonRow;
    }

    throw new SeasonNotFoundException(teamSlug, null);
  }
}
