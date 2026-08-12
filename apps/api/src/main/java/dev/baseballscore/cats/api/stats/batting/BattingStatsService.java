package dev.baseballscore.cats.api.stats.batting;

import dev.baseballscore.cats.api.game.GameStatus;
import dev.baseballscore.cats.api.stats.batting.dto.BattingStatsResponse;
import dev.baseballscore.cats.api.stats.batting.mapper.BattingStatsMapper;
import dev.baseballscore.cats.api.team.TeamQueryService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BattingStatsService {

  private final TeamQueryService teamQueryService;
  private final BattingStatsMapper battingStatsMapper;

  public BattingStatsService(
      TeamQueryService teamQueryService, BattingStatsMapper battingStatsMapper) {
    this.teamQueryService = teamQueryService;
    this.battingStatsMapper = battingStatsMapper;
  }

  /**
   * チームの打撃成績を集計し、指定された並び順で返す。
   *
   * <p>statusがnullの場合はcompleted、sortがnullの場合はbattingAverage、
   * includeGuestsがnullまたはfalseの場合は助っ人を除外する。
   *
   * @param teamSlug 対象チームのslug
   * @param seasonYear 対象年度。nullの場合は全年度
   * @param tournamentId 対象大会。nullの場合は指定なし
   * @param status 対象試合status
   * @param includeGuests 助っ人を含めるか
   * @param sort 並び順
   * @return 選手別打撃成績
   */
  @Transactional(readOnly = true)
  public List<BattingStatsResponse> getBattingStatsByTeamSlug(
      String teamSlug,
      Integer seasonYear,
      Long tournamentId,
      GameStatus status,
      Boolean includeGuests,
      BattingStatsSort sort) {
    var teamRow = this.teamQueryService.getActiveTeamBySlug(teamSlug);
    var effectiveStatus = status == null ? GameStatus.COMPLETED : status;
    var effectiveSort = sort == null ? BattingStatsSort.BATTING_AVERAGE : sort;
    var guestFlag = Boolean.TRUE.equals(includeGuests);

    var battingStatsRows =
        this.battingStatsMapper.aggregateBattingStatsByTeamId(
            teamRow.getId(), seasonYear, tournamentId, effectiveStatus.value(), guestFlag);

    var responses =
        new ArrayList<>(battingStatsRows.stream().map(BattingStatsResponse::from).toList());
    responses.sort(this.createComparator(effectiveSort));
    return responses;
  }

  private Comparator<BattingStatsResponse> createComparator(BattingStatsSort sort) {
    Comparator<BattingStatsResponse> comparator =
        switch (sort) {
          case HITS -> (left, right) -> compareDescending(left.hits(), right.hits());
          case HOME_RUNS -> (left, right) -> compareDescending(left.homeRuns(), right.homeRuns());
          case RUNS_BATTED_IN ->
              (left, right) -> compareDescending(left.runsBattedIn(), right.runsBattedIn());
          case OPS ->
              Comparator.comparing(
                      (BattingStatsResponse response) -> this.hasNoPlateAppearances(response))
                  .thenComparing(this::toOpsDecimal, Comparator.reverseOrder());
          case GAMES -> (left, right) -> compareDescending(left.games(), right.games());
          case BATTING_AVERAGE ->
              Comparator.comparing((BattingStatsResponse response) -> this.hasNoAtBats(response))
                  .thenComparing(this::toBattingAverageDecimal, Comparator.reverseOrder());
        };

    return comparator
        .thenComparing((left, right) -> compareAscending(left.playerId(), right.playerId()))
        .thenComparing((left, right) -> compareAscending(left.displayName(), right.displayName()));
  }

  private BigDecimal toOpsDecimal(BattingStatsResponse battingStatsResponse) {
    return new BigDecimal(battingStatsResponse.ops());
  }

  private BigDecimal toBattingAverageDecimal(BattingStatsResponse battingStatsResponse) {
    return new BigDecimal(battingStatsResponse.battingAverage());
  }

  private boolean hasNoAtBats(BattingStatsResponse battingStatsResponse) {
    return battingStatsResponse.atBats() == null || battingStatsResponse.atBats() == 0;
  }

  private boolean hasNoPlateAppearances(BattingStatsResponse battingStatsResponse) {
    return battingStatsResponse.plateAppearances() == null
        || battingStatsResponse.plateAppearances() == 0;
  }

  private static <T extends Comparable<? super T>> int compareDescending(T left, T right) {
    return compareAscending(right, left);
  }

  private static <T extends Comparable<? super T>> int compareAscending(T left, T right) {
    if (left == null && right == null) {
      return 0;
    }
    if (left == null) {
      return 1;
    }
    if (right == null) {
      return -1;
    }
    return left.compareTo(right);
  }
}
