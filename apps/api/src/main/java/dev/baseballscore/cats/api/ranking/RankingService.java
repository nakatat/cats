package dev.baseballscore.cats.api.ranking;

import dev.baseballscore.cats.api.common.exception.BadRequestException;
import dev.baseballscore.cats.api.common.query.QueryLimit;
import dev.baseballscore.cats.api.game.GameStatus;
import dev.baseballscore.cats.api.ranking.dto.RankingGroupResponse;
import dev.baseballscore.cats.api.ranking.dto.RankingLeaderResponse;
import dev.baseballscore.cats.api.ranking.dto.RankingResponse;
import dev.baseballscore.cats.api.ranking.mapper.RankingMapper;
import dev.baseballscore.cats.api.stats.batting.BattingStatsService;
import dev.baseballscore.cats.api.stats.batting.dto.BattingStatsResponse;
import dev.baseballscore.cats.api.stats.pitching.PitchingStatsService;
import dev.baseballscore.cats.api.stats.pitching.dto.PitchingStatsResponse;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RankingService {

  private static final BigDecimal BATTING_QUALIFICATION_RATE = new BigDecimal("1.5");
  private static final BigDecimal PITCHING_QUALIFICATION_RATE = new BigDecimal("0.5");
  private static final int OUTS_PER_INNING = 3;

  private final RankingMapper rankingMapper;
  private final BattingStatsService battingStatsService;
  private final PitchingStatsService pitchingStatsService;

  public RankingService(
      RankingMapper rankingMapper,
      BattingStatsService battingStatsService,
      PitchingStatsService pitchingStatsService) {
    this.rankingMapper = rankingMapper;
    this.battingStatsService = battingStatsService;
    this.pitchingStatsService = pitchingStatsService;
  }

  /**
   * 指定条件のランキングを作成する。
   *
   * <p>category未指定時は打撃・投手の既定カテゴリを返し、指定時はそのカテゴリだけを返す。
   * limitはQueryLimitで正規化し、qualifiedOnlyのnullはtrueとして扱う。対象カテゴリに応じて規定到達判定の
   * 閾値を対象試合数から算出し、打席数・投球アウト数で判定する。同じ値のleaderには同順位を付与する。
   *
   * @param teamSlug 対象チームのslug
   * @param seasonYear 対象年度。nullの場合は全年度
   * @param tournamentId 対象大会。nullの場合は指定なし
   * @param status 対象試合status。nullの場合はcompleted
   * @param includeGuests 助っ人を含めるか
   * @param qualifiedOnly 規定到達者だけに絞るか。nullはtrue
   * @param category 対象ランキングカテゴリ。nullは既定カテゴリ全体
   * @param limit 各カテゴリの最大件数
   * @return ランキングと規定到達判定に使用した閾値
   */
  @Transactional(readOnly = true)
  public RankingResponse getRankingsByTeamSlug(
      String teamSlug,
      Integer seasonYear,
      Long tournamentId,
      GameStatus status,
      Boolean includeGuests,
      Boolean qualifiedOnly,
      RankingCategory category,
      Integer limit) {
    var effectiveStatus = status == null ? GameStatus.COMPLETED : status;
    var effectiveLimit = QueryLimit.normalize(limit, "ranking");
    var effectiveQualifiedOnly = this.normalizeQualifiedOnly(qualifiedOnly);
    Integer requiredPlateAppearances = null;
    Integer requiredInningsPitchedOuts = null;
    if (this.requiresQualificationThresholds(category)) {
      var qualificationGames =
          this.rankingMapper.countGamesForPlateAppearanceQualification(
              teamSlug, seasonYear, tournamentId, effectiveStatus.value());
      requiredPlateAppearances = this.calculateRequiredPlateAppearances(qualificationGames);
      requiredInningsPitchedOuts = this.calculateRequiredInningsPitchedOuts(qualificationGames);
    }

    var battingGroups = new ArrayList<RankingGroupResponse>();
    if (category == null || category.isBatting()) {
      var battingStatsResponses =
          this.battingStatsService.getBattingStatsByTeamSlug(
              teamSlug, seasonYear, tournamentId, effectiveStatus, includeGuests, null);
      battingGroups.addAll(
          this.buildBattingGroups(
              battingStatsResponses,
              category,
              effectiveLimit,
              effectiveQualifiedOnly,
              requiredPlateAppearances));
    }

    var pitchingGroups = new ArrayList<RankingGroupResponse>();
    if (category == null || category.isPitching()) {
      var pitchingStatsResponses =
          this.pitchingStatsService.getPitchingStatsByTeamSlug(
              teamSlug, seasonYear, tournamentId, effectiveStatus, includeGuests, null);
      pitchingGroups.addAll(
          this.buildPitchingGroups(
              pitchingStatsResponses,
              category,
              effectiveLimit,
              effectiveQualifiedOnly,
              requiredInningsPitchedOuts));
    }

    return new RankingResponse(
        battingGroups,
        pitchingGroups,
        requiredPlateAppearances,
        requiredInningsPitchedOuts,
        requiredInningsPitchedOuts == null
            ? null
            : this.toInningsPitchedText(requiredInningsPitchedOuts));
  }

  private List<RankingGroupResponse> buildBattingGroups(
      List<BattingStatsResponse> battingStatsResponses,
      RankingCategory category,
      int limit,
      boolean qualifiedOnly,
      Integer requiredPlateAppearances) {
    var targetCategories =
        category == null
            ? RankingCategory.defaultBattingCategories()
            : (category.isBatting() ? List.of(category) : List.<RankingCategory>of());

    return targetCategories.stream()
        .map(
            targetCategory ->
                new RankingGroupResponse(
                    targetCategory.value(),
                    targetCategory.label(),
                    this.buildBattingLeaders(
                        battingStatsResponses,
                        targetCategory,
                        limit,
                        qualifiedOnly,
                        requiredPlateAppearances)))
        .toList();
  }

  private List<RankingGroupResponse> buildPitchingGroups(
      List<PitchingStatsResponse> pitchingStatsResponses,
      RankingCategory category,
      int limit,
      boolean qualifiedOnly,
      Integer requiredInningsPitchedOuts) {
    var targetCategories =
        category == null
            ? RankingCategory.defaultPitchingCategories()
            : (category.isPitching() ? List.of(category) : List.<RankingCategory>of());

    return targetCategories.stream()
        .map(
            targetCategory ->
                new RankingGroupResponse(
                    targetCategory.value(),
                    targetCategory.label(),
                    this.buildPitchingLeaders(
                        pitchingStatsResponses,
                        targetCategory,
                        limit,
                        qualifiedOnly,
                        requiredInningsPitchedOuts)))
        .toList();
  }

  private List<RankingLeaderResponse> buildBattingLeaders(
      List<BattingStatsResponse> battingStatsResponses,
      RankingCategory category,
      int limit,
      boolean qualifiedOnly,
      Integer requiredPlateAppearances) {
    var filteredResponses =
        battingStatsResponses.stream()
            .filter(
                battingStatsResponse ->
                    requiredPlateAppearances == null
                        || !qualifiedOnly
                        || this.isPlateAppearanceQualified(
                            battingStatsResponse, requiredPlateAppearances))
            .filter(
                battingStatsResponse ->
                    !this.isZeroOnlyRankingCategory(category)
                        || this.hasPositiveBattingRankingValue(battingStatsResponse, category))
            .toList();
    var comparator = this.createBattingComparator(category);
    var sortedResponses = filteredResponses.stream().sorted(comparator).limit(limit).toList();

    var leaders = new ArrayList<RankingLeaderResponse>();
    var currentRank = 0;
    BattingStatsResponse previousResponse = null;

    for (var index = 0; index < sortedResponses.size(); index++) {
      var currentResponse = sortedResponses.get(index);
      if (previousResponse == null
          || !this.hasSameBattingRankingValue(previousResponse, currentResponse, category)) {
        currentRank = index + 1;
      }

      leaders.add(
          this.toBattingLeaderResponse(
              currentRank, currentResponse, category, requiredPlateAppearances));
      previousResponse = currentResponse;
    }

    return leaders;
  }

  private List<RankingLeaderResponse> buildPitchingLeaders(
      List<PitchingStatsResponse> pitchingStatsResponses,
      RankingCategory category,
      int limit,
      boolean qualifiedOnly,
      Integer requiredInningsPitchedOuts) {
    var comparator = this.createPitchingComparator(category);
    var sortedResponses =
        pitchingStatsResponses.stream()
            .filter(
                pitchingStatsResponse ->
                    requiredInningsPitchedOuts == null
                        || !qualifiedOnly
                        || this.isInningsPitchedQualified(
                            pitchingStatsResponse, requiredInningsPitchedOuts))
            .filter(
                pitchingStatsResponse ->
                    !this.isZeroOnlyPitchingCategory(category)
                        || this.hasPositivePitchingRankingValue(pitchingStatsResponse, category))
            .sorted(comparator)
            .limit(limit)
            .toList();

    var leaders = new ArrayList<RankingLeaderResponse>();
    var currentRank = 0;
    PitchingStatsResponse previousResponse = null;

    for (var index = 0; index < sortedResponses.size(); index++) {
      var currentResponse = sortedResponses.get(index);
      if (previousResponse == null
          || !this.hasSamePitchingRankingValue(previousResponse, currentResponse, category)) {
        currentRank = index + 1;
      }

      leaders.add(
          this.toPitchingLeaderResponse(
              currentRank, currentResponse, category, requiredInningsPitchedOuts));
      previousResponse = currentResponse;
    }

    return leaders;
  }

  private Comparator<BattingStatsResponse> createBattingComparator(RankingCategory category) {
    Comparator<BattingStatsResponse> comparator =
        switch (category) {
          case BATTING_AVERAGE ->
              Comparator.comparing((BattingStatsResponse response) -> this.hasNoAtBats(response))
                  .thenComparing(this::toBattingAverageDecimal, Comparator.reverseOrder());
          case HITS -> (left, right) -> compareDescending(left.hits(), right.hits());
          case HOME_RUNS -> (left, right) -> compareDescending(left.homeRuns(), right.homeRuns());
          case RUNS_BATTED_IN ->
              (left, right) -> compareDescending(left.runsBattedIn(), right.runsBattedIn());
          case STOLEN_BASES ->
              (left, right) -> compareDescending(left.stolenBases(), right.stolenBases());
          case OPS ->
              Comparator.comparing(
                      (BattingStatsResponse response) -> this.hasNoPlateAppearances(response))
                  .thenComparing(this::toOpsDecimal, Comparator.reverseOrder());
          default ->
              throw new BadRequestException("Unsupported batting ranking category: " + category);
        };

    return comparator
        .thenComparing((left, right) -> compareAscending(left.playerId(), right.playerId()))
        .thenComparing((left, right) -> compareAscending(left.displayName(), right.displayName()));
  }

  private Comparator<PitchingStatsResponse> createPitchingComparator(RankingCategory category) {
    Comparator<PitchingStatsResponse> comparator =
        switch (category) {
          case EARNED_RUN_AVERAGE ->
              Comparator.comparing(
                      (PitchingStatsResponse response) -> this.hasNoOutsPitched(response))
                  .thenComparing(this::toEarnedRunAverageDecimal);
          case WINS -> (left, right) -> compareDescending(left.wins(), right.wins());
          case STRIKEOUTS ->
              (left, right) -> compareDescending(left.strikeouts(), right.strikeouts());
          case SAVES -> (left, right) -> compareDescending(left.saves(), right.saves());
          case HOLDS -> (left, right) -> compareDescending(left.holds(), right.holds());
          default ->
              throw new BadRequestException("Unsupported pitching ranking category: " + category);
        };

    return comparator
        .thenComparing((left, right) -> compareAscending(left.playerId(), right.playerId()))
        .thenComparing((left, right) -> compareAscending(left.displayName(), right.displayName()));
  }

  private RankingLeaderResponse toBattingLeaderResponse(
      int rank,
      BattingStatsResponse battingStatsResponse,
      RankingCategory category,
      Integer requiredPlateAppearances) {
    return new RankingLeaderResponse(
        rank,
        battingStatsResponse.playerId(),
        battingStatsResponse.displayName(),
        battingStatsResponse.profileImageUrl(),
        parseInteger(battingStatsResponse.uniformNumber()),
        battingStatsResponse.guest(),
        toBattingValue(battingStatsResponse, category),
        toBattingRawValue(battingStatsResponse, category),
        this.toBattingQualified(battingStatsResponse, category, requiredPlateAppearances));
  }

  private RankingLeaderResponse toPitchingLeaderResponse(
      int rank,
      PitchingStatsResponse pitchingStatsResponse,
      RankingCategory category,
      Integer requiredInningsPitchedOuts) {
    return new RankingLeaderResponse(
        rank,
        pitchingStatsResponse.playerId(),
        pitchingStatsResponse.displayName(),
        pitchingStatsResponse.profileImageUrl(),
        parseInteger(pitchingStatsResponse.uniformNumber()),
        pitchingStatsResponse.guest(),
        toPitchingValue(pitchingStatsResponse, category),
        toPitchingRawValue(pitchingStatsResponse, category),
        requiredInningsPitchedOuts == null
            ? null
            : this.isInningsPitchedQualified(pitchingStatsResponse, requiredInningsPitchedOuts));
  }

  private String toBattingValue(
      BattingStatsResponse battingStatsResponse, RankingCategory category) {
    return switch (category) {
      case BATTING_AVERAGE -> battingStatsResponse.battingAverage();
      case HITS -> String.valueOf(this.safeInteger(battingStatsResponse.hits()));
      case HOME_RUNS -> String.valueOf(this.safeInteger(battingStatsResponse.homeRuns()));
      case RUNS_BATTED_IN -> String.valueOf(this.safeInteger(battingStatsResponse.runsBattedIn()));
      case STOLEN_BASES -> String.valueOf(this.safeInteger(battingStatsResponse.stolenBases()));
      case OPS -> battingStatsResponse.ops();
      default -> throw new BadRequestException("Unsupported batting ranking category: " + category);
    };
  }

  private BigDecimal toBattingRawValue(
      BattingStatsResponse battingStatsResponse, RankingCategory category) {
    return switch (category) {
      case BATTING_AVERAGE -> new BigDecimal(battingStatsResponse.battingAverage());
      case HITS -> BigDecimal.valueOf(this.safeInteger(battingStatsResponse.hits()));
      case HOME_RUNS -> BigDecimal.valueOf(this.safeInteger(battingStatsResponse.homeRuns()));
      case RUNS_BATTED_IN ->
          BigDecimal.valueOf(this.safeInteger(battingStatsResponse.runsBattedIn()));
      case STOLEN_BASES -> BigDecimal.valueOf(this.safeInteger(battingStatsResponse.stolenBases()));
      case OPS -> new BigDecimal(battingStatsResponse.ops());
      default -> throw new BadRequestException("Unsupported batting ranking category: " + category);
    };
  }

  private String toPitchingValue(
      PitchingStatsResponse pitchingStatsResponse, RankingCategory category) {
    return switch (category) {
      case EARNED_RUN_AVERAGE -> pitchingStatsResponse.earnedRunAverage();
      case WINS -> String.valueOf(this.safeInteger(pitchingStatsResponse.wins()));
      case STRIKEOUTS -> String.valueOf(this.safeInteger(pitchingStatsResponse.strikeouts()));
      case SAVES -> String.valueOf(this.safeInteger(pitchingStatsResponse.saves()));
      case HOLDS -> String.valueOf(this.safeInteger(pitchingStatsResponse.holds()));
      default ->
          throw new BadRequestException("Unsupported pitching ranking category: " + category);
    };
  }

  private BigDecimal toPitchingRawValue(
      PitchingStatsResponse pitchingStatsResponse, RankingCategory category) {
    return switch (category) {
      case EARNED_RUN_AVERAGE -> new BigDecimal(pitchingStatsResponse.earnedRunAverage());
      case WINS -> BigDecimal.valueOf(this.safeInteger(pitchingStatsResponse.wins()));
      case STRIKEOUTS -> BigDecimal.valueOf(this.safeInteger(pitchingStatsResponse.strikeouts()));
      case SAVES -> BigDecimal.valueOf(this.safeInteger(pitchingStatsResponse.saves()));
      case HOLDS -> BigDecimal.valueOf(this.safeInteger(pitchingStatsResponse.holds()));
      default ->
          throw new BadRequestException("Unsupported pitching ranking category: " + category);
    };
  }

  private boolean hasSameBattingRankingValue(
      BattingStatsResponse left, BattingStatsResponse right, RankingCategory category) {
    return switch (category) {
      case BATTING_AVERAGE ->
          this.hasNoAtBats(left) == this.hasNoAtBats(right)
              && this.hasSameRawValue(
                  this.toBattingRawValue(left, category), this.toBattingRawValue(right, category));
      case OPS ->
          this.hasNoPlateAppearances(left) == this.hasNoPlateAppearances(right)
              && this.hasSameRawValue(
                  this.toBattingRawValue(left, category), this.toBattingRawValue(right, category));
      case HITS, HOME_RUNS, RUNS_BATTED_IN, STOLEN_BASES ->
          this.hasSameRawValue(
              this.toBattingRawValue(left, category), this.toBattingRawValue(right, category));
      default -> throw new BadRequestException("Unsupported batting ranking category: " + category);
    };
  }

  private boolean hasSamePitchingRankingValue(
      PitchingStatsResponse left, PitchingStatsResponse right, RankingCategory category) {
    return switch (category) {
      case EARNED_RUN_AVERAGE ->
          this.hasNoOutsPitched(left) == this.hasNoOutsPitched(right)
              && this.hasSameRawValue(
                  this.toPitchingRawValue(left, category),
                  this.toPitchingRawValue(right, category));
      case WINS, STRIKEOUTS, SAVES, HOLDS ->
          this.hasSameRawValue(
              this.toPitchingRawValue(left, category), this.toPitchingRawValue(right, category));
      default ->
          throw new BadRequestException("Unsupported pitching ranking category: " + category);
    };
  }

  private boolean hasNoAtBats(BattingStatsResponse battingStatsResponse) {
    return battingStatsResponse.atBats() == null || battingStatsResponse.atBats() == 0;
  }

  private boolean hasNoPlateAppearances(BattingStatsResponse battingStatsResponse) {
    return battingStatsResponse.plateAppearances() == null
        || battingStatsResponse.plateAppearances() == 0;
  }

  private boolean hasNoOutsPitched(PitchingStatsResponse pitchingStatsResponse) {
    return pitchingStatsResponse.outsPitched() == null || pitchingStatsResponse.outsPitched() == 0;
  }

  private boolean isZeroOnlyRankingCategory(RankingCategory category) {
    return category == RankingCategory.HOME_RUNS
        || category == RankingCategory.RUNS_BATTED_IN
        || category == RankingCategory.STOLEN_BASES;
  }

  private boolean hasPositiveBattingRankingValue(
      BattingStatsResponse battingStatsResponse, RankingCategory category) {
    return this.toBattingRawValue(battingStatsResponse, category).signum() > 0;
  }

  private boolean isZeroOnlyPitchingCategory(RankingCategory category) {
    return category == RankingCategory.WINS
        || category == RankingCategory.STRIKEOUTS
        || category == RankingCategory.SAVES
        || category == RankingCategory.HOLDS;
  }

  private boolean hasPositivePitchingRankingValue(
      PitchingStatsResponse pitchingStatsResponse, RankingCategory category) {
    return this.toPitchingRawValue(pitchingStatsResponse, category).signum() > 0;
  }

  private BigDecimal toBattingAverageDecimal(BattingStatsResponse battingStatsResponse) {
    return new BigDecimal(battingStatsResponse.battingAverage());
  }

  private BigDecimal toOpsDecimal(BattingStatsResponse battingStatsResponse) {
    return new BigDecimal(battingStatsResponse.ops());
  }

  private BigDecimal toEarnedRunAverageDecimal(PitchingStatsResponse pitchingStatsResponse) {
    return new BigDecimal(pitchingStatsResponse.earnedRunAverage());
  }

  private boolean hasSameRawValue(BigDecimal left, BigDecimal right) {
    return left.compareTo(right) == 0;
  }

  private boolean requiresQualificationThresholds(RankingCategory category) {
    return category == null
        || category == RankingCategory.BATTING_AVERAGE
        || category == RankingCategory.OPS;
  }

  private Integer calculateRequiredPlateAppearances(int games) {
    return this.roundUpToInteger(BigDecimal.valueOf(games).multiply(BATTING_QUALIFICATION_RATE));
  }

  private Integer calculateRequiredInningsPitchedOuts(int games) {
    return this.roundUpToInteger(
        BigDecimal.valueOf(games)
            .multiply(PITCHING_QUALIFICATION_RATE)
            .multiply(BigDecimal.valueOf(OUTS_PER_INNING)));
  }

  private Integer roundUpToInteger(BigDecimal value) {
    return value.setScale(0, RoundingMode.CEILING).intValueExact();
  }

  private boolean isPlateAppearanceQualified(
      BattingStatsResponse battingStatsResponse, Integer requiredPlateAppearances) {
    return battingStatsResponse.plateAppearances() != null
        && battingStatsResponse.plateAppearances() >= requiredPlateAppearances;
  }

  private boolean isInningsPitchedQualified(
      PitchingStatsResponse pitchingStatsResponse, Integer requiredInningsPitchedOuts) {
    return pitchingStatsResponse.outsPitched() != null
        && pitchingStatsResponse.outsPitched() >= requiredInningsPitchedOuts;
  }

  private String toInningsPitchedText(Integer outsPitched) {
    var wholeInnings = outsPitched / 3;
    var remainder = outsPitched % 3;
    if (remainder == 0) {
      return wholeInnings + "回";
    }
    return wholeInnings + "回" + remainder + "/3";
  }

  private Boolean toBattingQualified(
      BattingStatsResponse battingStatsResponse,
      RankingCategory category,
      Integer requiredPlateAppearances) {
    return requiredPlateAppearances == null
        ? null
        : this.isPlateAppearanceQualified(battingStatsResponse, requiredPlateAppearances);
  }

  private boolean normalizeQualifiedOnly(Boolean qualifiedOnly) {
    return qualifiedOnly == null || qualifiedOnly;
  }

  private Integer parseInteger(String value) {
    if (value == null || value.isBlank()) {
      return null;
    }

    try {
      return Integer.valueOf(value);
    } catch (NumberFormatException exception) {
      return null;
    }
  }

  private int safeInteger(Integer value) {
    return value == null ? 0 : value;
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
