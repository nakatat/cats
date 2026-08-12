package dev.baseballscore.cats.api.ranking;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import dev.baseballscore.cats.api.common.exception.BadRequestException;
import dev.baseballscore.cats.api.game.GameStatus;
import dev.baseballscore.cats.api.ranking.mapper.RankingMapper;
import dev.baseballscore.cats.api.stats.batting.BattingStatsService;
import dev.baseballscore.cats.api.stats.batting.dto.BattingStatsResponse;
import dev.baseballscore.cats.api.stats.pitching.PitchingStatsService;
import dev.baseballscore.cats.api.stats.pitching.dto.PitchingStatsResponse;
import dev.baseballscore.cats.api.team.TeamNotFoundException;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RankingServiceTest {

  @Mock private RankingMapper rankingMapper;

  @Mock private BattingStatsService battingStatsService;

  @Mock private PitchingStatsService pitchingStatsService;

  @InjectMocks private RankingService rankingService;

  @Test
  @DisplayName("getRankingsByTeamSlug defaults qualifiedOnly to true")
  void getRankings_defaultsQualifiedOnlyToTrue() {
    this.givenQualificationCount("cats", 2024, 1L, GameStatus.COMPLETED, 6);
    given(
            this.battingStatsService.getBattingStatsByTeamSlug(
                "cats", 2024, 1L, GameStatus.COMPLETED, true, null))
        .willReturn(
            List.of(
                createBattingStatsResponse(
                    2L, "B", "8", false, 15, 15, 6, 1, 7, 1, "0.400", "1.100"),
                createBattingStatsResponse(
                    1L, "A", "7", false, 12, 10, 3, 2, 4, 3, "0.300", "0.800"),
                createBattingStatsResponse(
                    3L, "C", "9", false, 8, 8, 2, 0, 2, 5, "0.250", "0.700")));
    given(
            this.pitchingStatsService.getPitchingStatsByTeamSlug(
                "cats", 2024, 1L, GameStatus.COMPLETED, true, null))
        .willReturn(
            List.of(
                createPitchingStatsResponse("P1", "11", false, 21, 3, 3, 20, 1, 0, "3.000"),
                createPitchingStatsResponse("P2", "12", false, 21, 1, 5, 12, 0, 2, "1.500"),
                createPitchingStatsResponse("P3", "13", false, 21, 2, 1, 25, 2, 1, "2.250")));

    var response =
        this.rankingService.getRankingsByTeamSlug(
            "cats", 2024, 1L, GameStatus.COMPLETED, true, null, null, 2);

    verify(this.rankingMapper)
        .countGamesForPlateAppearanceQualification("cats", 2024, 1L, "completed");
    verify(this.battingStatsService)
        .getBattingStatsByTeamSlug("cats", 2024, 1L, GameStatus.COMPLETED, true, null);
    verify(this.pitchingStatsService)
        .getPitchingStatsByTeamSlug("cats", 2024, 1L, GameStatus.COMPLETED, true, null);

    assertEquals(6, response.batting().size());
    assertEquals(4, response.pitching().size());
    assertEquals("battingAverage", response.batting().get(0).category());
    assertEquals(2, response.batting().get(0).leaders().size());
    assertEquals(1, response.batting().get(0).leaders().get(0).rank());
    assertEquals("B", response.batting().get(0).leaders().get(0).displayName());
    assertEquals(Boolean.TRUE, response.batting().get(0).leaders().get(0).qualified());
    assertEquals("A", response.batting().get(0).leaders().get(1).displayName());
    assertEquals(Boolean.TRUE, response.batting().get(0).leaders().get(1).qualified());
    assertEquals("hits", response.batting().get(1).category());
    assertEquals("B", response.batting().get(1).leaders().get(0).displayName());
    assertEquals("A", response.batting().get(1).leaders().get(1).displayName());
    assertEquals("stolenBases", response.batting().get(4).category());
    assertEquals("A", response.batting().get(4).leaders().get(0).displayName());
    assertEquals("B", response.batting().get(4).leaders().get(1).displayName());
    assertEquals("ops", response.batting().get(5).category());
    assertEquals(9, response.requiredPlateAppearances());
    assertEquals(9, response.requiredInningsPitchedOuts());
    assertEquals("3回", response.requiredInningsPitchedText());
    assertEquals("earnedRunAverage", response.pitching().get(0).category());
    assertEquals(1, response.pitching().get(0).leaders().get(0).rank());
    assertEquals("P2", response.pitching().get(0).leaders().get(0).displayName());
    assertEquals("P3", response.pitching().get(0).leaders().get(1).displayName());
    assertEquals("strikeouts", response.pitching().get(2).category());
    assertEquals("P3", response.pitching().get(2).leaders().get(0).displayName());
    assertEquals("P1", response.pitching().get(2).leaders().get(1).displayName());
    assertEquals("saves", response.pitching().get(3).category());
  }

  @Test
  @DisplayName(
      "getRankingsByTeamSlug with qualifiedOnly=false keeps battingAverage non-qualified players")
  void getRankings_withQualifiedOnlyFalse_keepsBattingAverageNonQualifiedPlayers() {
    this.givenQualificationCount("cats", null, null, GameStatus.COMPLETED, 6);
    given(
            this.battingStatsService.getBattingStatsByTeamSlug(
                "cats", null, null, GameStatus.COMPLETED, null, null))
        .willReturn(
            List.of(
                createBattingStatsResponse(2L, "B", "8", false, 5, 5, 3, 1, 1, 1, "0.600", "1.200"),
                createBattingStatsResponse(
                    1L, "A", "7", false, 12, 10, 4, 2, 4, 3, "0.400", "0.900"),
                createBattingStatsResponse(
                    3L, "C", "9", false, 15, 15, 5, 0, 2, 5, "0.333", "0.700")));

    var response =
        this.rankingService.getRankingsByTeamSlug(
            "cats", null, null, null, null, false, RankingCategory.BATTING_AVERAGE, 5);

    verify(this.rankingMapper)
        .countGamesForPlateAppearanceQualification("cats", null, null, "completed");

    var leaders = response.batting().get(0).leaders();
    assertEquals(1, leaders.get(0).rank());
    assertEquals(2, leaders.get(1).rank());
    assertEquals(3, leaders.get(2).rank());
    assertEquals("B", leaders.get(0).displayName());
    assertEquals(Boolean.FALSE, leaders.get(0).qualified());
    assertEquals("A", leaders.get(1).displayName());
    assertEquals(Boolean.TRUE, leaders.get(1).qualified());
    assertEquals("C", leaders.get(2).displayName());
    assertEquals(Boolean.TRUE, leaders.get(2).qualified());
  }

  @Test
  @DisplayName("getRankingsByTeamSlug filters ops by required plate appearances")
  void getRankings_filtersOpsByRequiredPlateAppearances() {
    this.givenQualificationCount("cats", null, null, GameStatus.COMPLETED, 6);
    given(
            this.battingStatsService.getBattingStatsByTeamSlug(
                "cats", null, null, GameStatus.COMPLETED, null, null))
        .willReturn(
            List.of(
                createBattingStatsResponse(2L, "B", "8", false, 5, 5, 3, 1, 1, 1, "0.600", "1.200"),
                createBattingStatsResponse(
                    1L, "A", "7", false, 12, 10, 4, 2, 4, 3, "0.400", "0.900"),
                createBattingStatsResponse(
                    3L, "C", "9", false, 15, 15, 5, 0, 2, 5, "0.333", "0.700")));

    var response =
        this.rankingService.getRankingsByTeamSlug(
            "cats", null, null, null, null, true, RankingCategory.OPS, 5);

    verify(this.rankingMapper)
        .countGamesForPlateAppearanceQualification("cats", null, null, "completed");

    var leaders = response.batting().get(0).leaders();
    assertEquals(1, leaders.get(0).rank());
    assertEquals(2, leaders.get(1).rank());
    assertEquals("A", leaders.get(0).displayName());
    assertEquals(Boolean.TRUE, leaders.get(0).qualified());
    assertEquals("C", leaders.get(1).displayName());
    assertEquals(Boolean.TRUE, leaders.get(1).qualified());
  }

  @Test
  @DisplayName("getRankingsByTeamSlug uses competition ranking for batting hits")
  void getRankings_usesCompetitionRankingForBatting() {
    given(
            this.battingStatsService.getBattingStatsByTeamSlug(
                "cats", null, null, GameStatus.COMPLETED, null, null))
        .willReturn(
            List.of(
                createBattingStatsResponse(
                    2L, "A", "7", false, 5, 15, 10, 1, 5, 2, "0.667", "1.500"),
                createBattingStatsResponse(
                    1L, "B", "8", false, 5, 15, 10, 1, 5, 2, "0.667", "1.500"),
                createBattingStatsResponse(
                    3L, "C", "9", false, 5, 15, 8, 1, 5, 2, "0.533", "1.200")));

    var response =
        this.rankingService.getRankingsByTeamSlug(
            "cats", null, null, null, null, false, RankingCategory.HITS, 5);

    verifyNoInteractions(this.rankingMapper);
    var leaders = response.batting().get(0).leaders();
    assertEquals(1, leaders.get(0).rank());
    assertEquals(1, leaders.get(1).rank());
    assertEquals(3, leaders.get(2).rank());
    assertEquals("B", leaders.get(0).displayName());
    assertEquals("A", leaders.get(1).displayName());
    assertEquals("C", leaders.get(2).displayName());
    assertNull(leaders.get(0).qualified());
  }

  @Test
  @DisplayName("getRankingsByTeamSlug uses competition ranking for pitching ERA")
  void getRankings_usesCompetitionRankingForPitching() {
    given(
            this.pitchingStatsService.getPitchingStatsByTeamSlug(
                "cats", null, null, GameStatus.COMPLETED, null, null))
        .willReturn(
            List.of(
                createPitchingStatsResponse(1L, "A", "11", false, 21, 3, 3, 20, 1, 0, "3.000"),
                createPitchingStatsResponse(2L, "B", "12", false, 21, 3, 3, 20, 1, 0, "3.000"),
                createPitchingStatsResponse(3L, "C", "13", false, 21, 4, 2, 15, 0, 1, "4.000")));

    var response =
        this.rankingService.getRankingsByTeamSlug(
            "cats", null, null, null, null, true, RankingCategory.EARNED_RUN_AVERAGE, 5);

    verifyNoInteractions(this.rankingMapper);
    var leaders = response.pitching().get(0).leaders();
    assertEquals(1, leaders.get(0).rank());
    assertEquals(1, leaders.get(1).rank());
    assertEquals(3, leaders.get(2).rank());
    assertEquals("A", leaders.get(0).displayName());
    assertEquals("B", leaders.get(1).displayName());
    assertEquals("C", leaders.get(2).displayName());
  }

  @Test
  @DisplayName("getRankingsByTeamSlug separates battingAverage zero denominator from zero value")
  void getRankings_separatesBattingAverageZeroDenominator() {
    this.givenQualificationCount("cats", null, null, GameStatus.COMPLETED, 6);
    given(
            this.battingStatsService.getBattingStatsByTeamSlug(
                "cats", null, null, GameStatus.COMPLETED, null, null))
        .willReturn(
            List.of(
                createBattingStatsResponse(
                    1L, "A", "7", false, 10, 10, 0, 0, 0, 0, "0.000", "0.000"),
                createBattingStatsResponse(2L, "B", "8", false, 0, 0, 0, 0, 0, 0, "0.000", "0.000"),
                createBattingStatsResponse(
                    3L, "C", "9", false, 10, 10, 3, 0, 0, 0, "0.300", "0.700")));

    var response =
        this.rankingService.getRankingsByTeamSlug(
            "cats", null, null, null, null, false, RankingCategory.BATTING_AVERAGE, 5);

    var leaders = response.batting().get(0).leaders();
    assertEquals(1, leaders.get(0).rank());
    assertEquals(2, leaders.get(1).rank());
    assertEquals(3, leaders.get(2).rank());
    assertEquals("C", leaders.get(0).displayName());
    assertEquals(Boolean.TRUE, leaders.get(0).qualified());
    assertEquals("A", leaders.get(1).displayName());
    assertEquals(Boolean.TRUE, leaders.get(1).qualified());
    assertEquals("B", leaders.get(2).displayName());
    assertEquals(Boolean.FALSE, leaders.get(2).qualified());
  }

  @Test
  @DisplayName("getRankingsByTeamSlug separates ops zero denominator from zero value")
  void getRankings_separatesOpsZeroDenominator() {
    this.givenQualificationCount("cats", null, null, GameStatus.COMPLETED, 6);
    given(
            this.battingStatsService.getBattingStatsByTeamSlug(
                "cats", null, null, GameStatus.COMPLETED, null, null))
        .willReturn(
            List.of(
                createBattingStatsResponse(
                    1L, "A", "7", false, 10, 4, 0, 0, 0, 0, "0.000", "0.000"),
                createBattingStatsResponse(2L, "B", "8", false, 0, 0, 0, 0, 0, 0, "0.000", "0.000"),
                createBattingStatsResponse(
                    3L, "C", "9", false, 10, 4, 2, 0, 0, 0, "0.500", "0.700")));

    var response =
        this.rankingService.getRankingsByTeamSlug(
            "cats", null, null, null, null, false, RankingCategory.OPS, 5);

    var leaders = response.batting().get(0).leaders();
    assertEquals(1, leaders.get(0).rank());
    assertEquals(2, leaders.get(1).rank());
    assertEquals(3, leaders.get(2).rank());
    assertEquals("C", leaders.get(0).displayName());
    assertEquals(Boolean.TRUE, leaders.get(0).qualified());
    assertEquals("A", leaders.get(1).displayName());
    assertEquals(Boolean.TRUE, leaders.get(1).qualified());
    assertEquals("B", leaders.get(2).displayName());
    assertEquals(Boolean.FALSE, leaders.get(2).qualified());
  }

  @Test
  @DisplayName("getRankingsByTeamSlug separates pitching ERA zero outs from zero value")
  void getRankings_separatesPitchingEraZeroOuts() {
    given(
            this.pitchingStatsService.getPitchingStatsByTeamSlug(
                "cats", null, null, GameStatus.COMPLETED, null, null))
        .willReturn(
            List.of(
                createPitchingStatsResponse(1L, "A", "11", false, 21, 0, 1, 1, 0, 0, "0.000"),
                createPitchingStatsResponse(2L, "B", "12", false, 0, 0, 0, 0, 0, 0, "0.000"),
                createPitchingStatsResponse(3L, "C", "13", false, 21, 3, 1, 1, 0, 0, "1.500")));

    var response =
        this.rankingService.getRankingsByTeamSlug(
            "cats", null, null, null, null, true, RankingCategory.EARNED_RUN_AVERAGE, 5);

    var leaders = response.pitching().get(0).leaders();
    assertEquals(1, leaders.get(0).rank());
    assertEquals(2, leaders.get(1).rank());
    assertEquals(3, leaders.get(2).rank());
    assertEquals("A", leaders.get(0).displayName());
    assertEquals("C", leaders.get(1).displayName());
    assertEquals("B", leaders.get(2).displayName());
    assertNull(leaders.get(0).qualified());
    assertNull(leaders.get(1).qualified());
    assertNull(leaders.get(2).qualified());
  }

  @Test
  @DisplayName("getRankings excludes zero-only counting leaders")
  void getRankings_excludesZeroOnlyCountingLeaders() {
    given(
            this.battingStatsService.getBattingStatsByTeamSlug(
                "cats", null, null, GameStatus.COMPLETED, null, null))
        .willReturn(
            List.of(
                createBattingStatsResponse(
                    1L, "A", "7", false, 10, 10, 0, 0, 0, 0, "0.000", "0.000"),
                createBattingStatsResponse(
                    2L, "B", "8", false, 10, 10, 1, 1, 1, 1, "0.100", "0.200")));

    var homeRunLeaders =
        this.rankingService
            .getRankingsByTeamSlug(
                "cats", null, null, null, null, false, RankingCategory.HOME_RUNS, 1)
            .batting()
            .get(0)
            .leaders();
    var runsBattedInLeaders =
        this.rankingService
            .getRankingsByTeamSlug(
                "cats", null, null, null, null, false, RankingCategory.RUNS_BATTED_IN, 1)
            .batting()
            .get(0)
            .leaders();

    assertEquals("B", homeRunLeaders.get(0).displayName());
    assertEquals("B", runsBattedInLeaders.get(0).displayName());

    given(
            this.pitchingStatsService.getPitchingStatsByTeamSlug(
                "cats", null, null, GameStatus.COMPLETED, null, null))
        .willReturn(
            List.of(
                createPitchingStatsResponse("P0", "11", false, 21, 0, 0, 0, 0, 0, "0.000"),
                createPitchingStatsResponse("P1", "12", false, 21, 1, 1, 1, 1, 0, "1.000")));

    var winLeaders =
        this.rankingService
            .getRankingsByTeamSlug("cats", null, null, null, null, false, RankingCategory.WINS, 1)
            .pitching()
            .get(0)
            .leaders();

    assertEquals("P1", winLeaders.get(0).displayName());
  }

  @Test
  @DisplayName("getRankingsByTeamSlug with batting category returns batting only")
  void getRankings_withBattingCategory_returnsBattingOnly() {
    given(
            this.battingStatsService.getBattingStatsByTeamSlug(
                "cats", null, null, GameStatus.COMPLETED, null, null))
        .willReturn(
            List.of(
                createBattingStatsResponse(
                    1L, "A", "7", false, 4, 12, 3, 2, 4, 3, "0.250", "0.800")));

    var response =
        this.rankingService.getRankingsByTeamSlug(
            "cats", null, null, null, null, true, RankingCategory.HITS, 5);

    verifyNoInteractions(this.rankingMapper);
    verify(this.battingStatsService)
        .getBattingStatsByTeamSlug("cats", null, null, GameStatus.COMPLETED, null, null);
    verifyNoInteractions(this.pitchingStatsService);
    assertEquals(1, response.batting().size());
    assertEquals("hits", response.batting().get(0).category());
    assertEquals(0, response.pitching().size());
  }

  @Test
  @DisplayName("getRankingsByTeamSlug with pitching category returns pitching only")
  void getRankings_withPitchingCategory_returnsPitchingOnly() {
    given(
            this.pitchingStatsService.getPitchingStatsByTeamSlug(
                "cats", null, null, GameStatus.COMPLETED, null, null))
        .willReturn(
            List.of(createPitchingStatsResponse("P1", "11", false, 21, 3, 3, 20, 1, 0, "3.000")));

    var response =
        this.rankingService.getRankingsByTeamSlug(
            "cats", null, null, null, null, true, RankingCategory.WINS, 5);

    verifyNoInteractions(this.rankingMapper);
    verify(this.pitchingStatsService)
        .getPitchingStatsByTeamSlug("cats", null, null, GameStatus.COMPLETED, null, null);
    verifyNoInteractions(this.battingStatsService);
    assertEquals(0, response.batting().size());
    assertEquals(1, response.pitching().size());
    assertEquals("wins", response.pitching().get(0).category());
  }

  @Test
  @DisplayName("getRankingsByTeamSlug rejects invalid limit")
  void getRankings_rejectsInvalidLimit() {
    var exception =
        assertThrows(
            BadRequestException.class,
            () ->
                this.rankingService.getRankingsByTeamSlug(
                    "cats", null, null, null, null, null, null, 0));

    assertEquals("INVALID_QUERY_PARAMETER", exception.getCode());
    assertEquals("リクエストパラメータが不正です。", exception.getResponseMessage());
    verifyNoInteractions(this.rankingMapper);
    verifyNoInteractions(this.battingStatsService);
    verifyNoInteractions(this.pitchingStatsService);
  }

  @Test
  @DisplayName("getRankingsByTeamSlug rejects limit over maximum")
  void getRankings_rejectsLimitOverMaximum() {
    var exception =
        assertThrows(
            BadRequestException.class,
            () ->
                this.rankingService.getRankingsByTeamSlug(
                    "cats", null, null, null, null, null, null, 21));

    assertEquals("INVALID_QUERY_PARAMETER", exception.getCode());
    assertEquals("リクエストパラメータが不正です。", exception.getResponseMessage());
    verifyNoInteractions(this.rankingMapper);
    verifyNoInteractions(this.battingStatsService);
    verifyNoInteractions(this.pitchingStatsService);
  }

  @Test
  @DisplayName("getRankingsByTeamSlug propagates TeamNotFoundException")
  void getRankings_propagatesTeamNotFoundException() {
    this.givenQualificationCount("nope", null, null, GameStatus.COMPLETED, 0);
    given(
            this.battingStatsService.getBattingStatsByTeamSlug(
                "nope", null, null, GameStatus.COMPLETED, null, null))
        .willThrow(new TeamNotFoundException("nope"));

    var exception =
        assertThrows(
            TeamNotFoundException.class,
            () ->
                this.rankingService.getRankingsByTeamSlug(
                    "nope", null, null, null, null, null, null, 5));

    verify(this.rankingMapper)
        .countGamesForPlateAppearanceQualification("nope", null, null, "completed");
    verify(this.battingStatsService)
        .getBattingStatsByTeamSlug("nope", null, null, GameStatus.COMPLETED, null, null);
    verify(this.pitchingStatsService, never())
        .getPitchingStatsByTeamSlug("nope", null, null, GameStatus.COMPLETED, null, null);
    assertEquals("TEAM_NOT_FOUND", exception.getCode());
    assertEquals("チームが見つかりません。", exception.getResponseMessage());
  }

  private void givenQualificationCount(
      String teamSlug, Integer seasonYear, Long tournamentId, GameStatus status, int count) {
    given(
            this.rankingMapper.countGamesForPlateAppearanceQualification(
                teamSlug, seasonYear, tournamentId, status.value()))
        .willReturn(count);
  }

  private static BattingStatsResponse createBattingStatsResponse(
      Long playerId,
      String displayName,
      String uniformNumber,
      boolean guest,
      Integer plateAppearances,
      Integer atBats,
      Integer hits,
      Integer homeRuns,
      Integer runsBattedIn,
      Integer stolenBases,
      String battingAverage,
      String ops) {
    return new BattingStatsResponse(
        playerId,
        displayName,
        null,
        uniformNumber,
        guest,
        1,
        plateAppearances,
        atBats,
        hits,
        0,
        0,
        homeRuns,
        runsBattedIn,
        0,
        0,
        0,
        0,
        0,
        0,
        stolenBases,
        0,
        0,
        battingAverage,
        "0.000",
        "0.000",
        ops);
  }

  private static PitchingStatsResponse createPitchingStatsResponse(
      String displayName,
      String uniformNumber,
      boolean guest,
      Integer outsPitched,
      Integer earnedRuns,
      Integer wins,
      Integer strikeouts,
      Integer saves,
      Integer holds,
      String earnedRunAverage) {
    return new PitchingStatsResponse(
        guest ? null : 1L,
        displayName,
        null,
        uniformNumber,
        guest,
        1,
        outsPitched,
        0,
        0,
        0,
        0,
        0,
        earnedRuns,
        0,
        0,
        strikeouts,
        wins,
        0,
        saves,
        holds,
        "0回",
        earnedRunAverage,
        "0.000",
        "0.000");
  }

  private static PitchingStatsResponse createPitchingStatsResponse(
      Long playerId,
      String displayName,
      String uniformNumber,
      boolean guest,
      Integer outsPitched,
      Integer earnedRuns,
      Integer wins,
      Integer strikeouts,
      Integer saves,
      Integer holds,
      String earnedRunAverage) {
    return new PitchingStatsResponse(
        playerId,
        displayName,
        null,
        uniformNumber,
        guest,
        1,
        outsPitched,
        0,
        0,
        0,
        0,
        0,
        earnedRuns,
        0,
        0,
        strikeouts,
        wins,
        0,
        saves,
        holds,
        "0回",
        earnedRunAverage,
        "0.000",
        "0.000");
  }
}
