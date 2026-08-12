package dev.baseballscore.cats.api.stats.pitching;

import dev.baseballscore.cats.api.game.GameStatus;
import dev.baseballscore.cats.api.stats.pitching.dto.PitchingStatsResponse;
import dev.baseballscore.cats.api.stats.pitching.mapper.PitchingStatsMapper;
import dev.baseballscore.cats.api.team.TeamQueryService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PitchingStatsService {

  private final TeamQueryService teamQueryService;
  private final PitchingStatsMapper pitchingStatsMapper;

  public PitchingStatsService(
      TeamQueryService teamQueryService, PitchingStatsMapper pitchingStatsMapper) {
    this.teamQueryService = teamQueryService;
    this.pitchingStatsMapper = pitchingStatsMapper;
  }

  /**
   * チームの投手成績を集計し、指定された並び順で返す。
   *
   * <p>statusがnullの場合はcompleted、sortがnullの場合はearnedRunAverage、
   * includeGuestsがnullまたはfalseの場合は助っ人を除外する。
   *
   * @param teamSlug 対象チームのslug
   * @param seasonYear 対象年度。nullの場合は全年度
   * @param tournamentId 対象大会。nullの場合は指定なし
   * @param status 対象試合status
   * @param includeGuests 助っ人を含めるか
   * @param sort 並び順
   * @return 選手別投手成績
   */
  @Transactional(readOnly = true)
  public List<PitchingStatsResponse> getPitchingStatsByTeamSlug(
      String teamSlug,
      Integer seasonYear,
      Long tournamentId,
      GameStatus status,
      Boolean includeGuests,
      PitchingStatsSort sort) {
    var teamRow = this.teamQueryService.getActiveTeamBySlug(teamSlug);
    var effectiveStatus = status == null ? GameStatus.COMPLETED : status;
    var effectiveSort = sort == null ? PitchingStatsSort.EARNED_RUN_AVERAGE : sort;
    var guestFlag = Boolean.TRUE.equals(includeGuests);

    var pitchingStatsRows =
        this.pitchingStatsMapper.aggregatePitchingStatsByTeamId(
            teamRow.getId(), seasonYear, tournamentId, effectiveStatus.value(), guestFlag);

    var responses =
        new ArrayList<>(pitchingStatsRows.stream().map(PitchingStatsResponse::from).toList());
    responses.sort(this.createComparator(effectiveSort));
    return responses;
  }

  private Comparator<PitchingStatsResponse> createComparator(PitchingStatsSort sort) {
    Comparator<PitchingStatsResponse> comparator =
        switch (sort) {
          case WINS -> (left, right) -> compareDescending(left.wins(), right.wins());
          case STRIKEOUTS ->
              (left, right) -> compareDescending(left.strikeouts(), right.strikeouts());
          case SAVES -> (left, right) -> compareDescending(left.saves(), right.saves());
          case HOLDS -> (left, right) -> compareDescending(left.holds(), right.holds());
          case OUTS_PITCHED ->
              (left, right) -> compareDescending(left.outsPitched(), right.outsPitched());
          case GAMES -> (left, right) -> compareDescending(left.games(), right.games());
          case EARNED_RUN_AVERAGE ->
              Comparator.comparing(this::hasNoOutsPitched)
                  .thenComparing(this::toEarnedRunAverageDecimal);
        };

    return comparator
        .thenComparing((left, right) -> compareAscending(left.playerId(), right.playerId()))
        .thenComparing((left, right) -> compareAscending(left.displayName(), right.displayName()));
  }

  private boolean hasNoOutsPitched(PitchingStatsResponse pitchingStatsResponse) {
    return pitchingStatsResponse.outsPitched() == null || pitchingStatsResponse.outsPitched() == 0;
  }

  private BigDecimal toEarnedRunAverageDecimal(PitchingStatsResponse pitchingStatsResponse) {
    return new BigDecimal(pitchingStatsResponse.earnedRunAverage());
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
