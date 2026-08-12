package dev.baseballscore.cats.api.stats.batting;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import dev.baseballscore.cats.api.common.exception.BadRequestException;
import dev.baseballscore.cats.api.game.GameStatus;
import dev.baseballscore.cats.api.stats.batting.mapper.BattingStatsMapper;
import dev.baseballscore.cats.api.stats.batting.mapper.model.BattingStatsRow;
import dev.baseballscore.cats.api.team.TeamNotFoundException;
import dev.baseballscore.cats.api.team.TeamQueryService;
import dev.baseballscore.cats.api.team.mapper.model.TeamRow;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BattingStatsServiceTest {

  @Mock private TeamQueryService teamQueryService;

  @Mock private BattingStatsMapper battingStatsMapper;

  @InjectMocks private BattingStatsService battingStatsService;

  private TeamRow teamRow;

  @BeforeEach
  void setUp() {
    this.teamRow = createTeamRow();
  }

  @Test
  @DisplayName("getBattingStatsByTeamSlug returns batting stats")
  void getBattingStatsByTeamSlug_returnsBattingStats() {
    var firstRow =
        createBattingStatsRow(
            1L, "山田 太郎", "7", false, 5, 18, 15, 6, 2, 0, 1, 5, 4, 2, 1, 3, 0, 0, 2, 1, 1);
    var secondRow =
        createBattingStatsRow(
            null, "助っ人A", null, true, 1, 3, 2, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.battingStatsMapper.aggregateBattingStatsByTeamId(10L, 2024, 1L, "completed", true))
        .willReturn(List.of(secondRow, firstRow));

    var responses =
        this.battingStatsService.getBattingStatsByTeamSlug(
            "cats", 2024, 1L, GameStatus.COMPLETED, true, BattingStatsSort.BATTING_AVERAGE);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.battingStatsMapper).aggregateBattingStatsByTeamId(10L, 2024, 1L, "completed", true);
    assertEquals(2, responses.size());
    assertEquals("助っ人A", responses.get(0).displayName());
    assertEquals("0.500", responses.get(0).battingAverage());
    assertEquals("1.000", responses.get(0).ops());
    assertEquals("山田 太郎", responses.get(1).displayName());
    assertEquals("0.400", responses.get(1).battingAverage());
    assertEquals("0.733", responses.get(1).sluggingPercentage());
    assertEquals("1.233", responses.get(1).ops());
  }

  @Test
  @DisplayName("getBattingStatsByTeamSlug sorts by OPS")
  void getBattingStatsByTeamSlug_sortsByOps() {
    var firstRow =
        createBattingStatsRow(
            1L, "山田 太郎", "7", false, 5, 18, 15, 6, 2, 0, 1, 5, 4, 2, 1, 3, 0, 0, 2, 1, 1);
    var secondRow =
        createBattingStatsRow(
            null, "助っ人A", null, true, 1, 3, 2, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.battingStatsMapper.aggregateBattingStatsByTeamId(10L, 2024, 1L, "completed", true))
        .willReturn(List.of(secondRow, firstRow));

    var responses =
        this.battingStatsService.getBattingStatsByTeamSlug(
            "cats", 2024, 1L, GameStatus.COMPLETED, true, BattingStatsSort.OPS);

    assertEquals("山田 太郎", responses.get(0).displayName());
    assertEquals("1.233", responses.get(0).ops());
    assertEquals("助っ人A", responses.get(1).displayName());
    assertEquals("1.000", responses.get(1).ops());
  }

  @Test
  @DisplayName("getBattingStatsByTeamSlug sorts battingAverage ascending with zero at bats last")
  void getBattingStatsByTeamSlug_sortsBattingAverageWithZeroAtBatsLast() {
    var rows =
        List.of(
            createBattingStatsRow(
                1L, "A", "7", false, 1, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
            createBattingStatsRow(
                2L, "B", "8", false, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
            createBattingStatsRow(
                3L, "C", "9", false, 1, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(
            this.battingStatsMapper.aggregateBattingStatsByTeamId(
                10L, null, null, "completed", false))
        .willReturn(rows);

    var responses =
        this.battingStatsService.getBattingStatsByTeamSlug(
            "cats", null, null, GameStatus.COMPLETED, false, BattingStatsSort.BATTING_AVERAGE);

    assertEquals("A", responses.get(0).displayName());
    assertEquals("C", responses.get(1).displayName());
    assertEquals("B", responses.get(2).displayName());
  }

  @Test
  @DisplayName("getBattingStatsByTeamSlug sorts OPS descending with zero plate appearances last")
  void getBattingStatsByTeamSlug_sortsOpsWithZeroPlateAppearancesLast() {
    var rows =
        List.of(
            createBattingStatsRow(
                1L, "A", "7", false, 1, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
            createBattingStatsRow(
                2L, "B", "8", false, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
            createBattingStatsRow(
                3L, "C", "9", false, 1, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(
            this.battingStatsMapper.aggregateBattingStatsByTeamId(
                10L, null, null, "completed", false))
        .willReturn(rows);

    var responses =
        this.battingStatsService.getBattingStatsByTeamSlug(
            "cats", null, null, GameStatus.COMPLETED, false, BattingStatsSort.OPS);

    assertEquals("A", responses.get(0).displayName());
    assertEquals("C", responses.get(1).displayName());
    assertEquals("B", responses.get(2).displayName());
  }

  @Test
  @DisplayName("getBattingStatsByTeamSlug sorts by home runs")
  void getBattingStatsByTeamSlug_sortsByHomeRuns() {
    var firstRow =
        createBattingStatsRow(
            1L, "山田 太郎", "7", false, 5, 18, 15, 6, 2, 0, 1, 5, 4, 2, 1, 3, 0, 0, 2, 1, 1);
    var secondRow =
        createBattingStatsRow(
            null, "助っ人A", null, true, 1, 3, 2, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.battingStatsMapper.aggregateBattingStatsByTeamId(10L, 2024, 1L, "completed", true))
        .willReturn(List.of(secondRow, firstRow));

    var responses =
        this.battingStatsService.getBattingStatsByTeamSlug(
            "cats", 2024, 1L, GameStatus.COMPLETED, true, BattingStatsSort.HOME_RUNS);

    assertEquals("山田 太郎", responses.get(0).displayName());
    assertEquals(1, responses.get(0).homeRuns());
    assertEquals("助っ人A", responses.get(1).displayName());
    assertEquals(0, responses.get(1).homeRuns());
  }

  @Test
  @DisplayName("getBattingStatsByTeamSlug sorts by runs batted in")
  void getBattingStatsByTeamSlug_sortsByRunsBattedIn() {
    var firstRow =
        createBattingStatsRow(
            1L, "山田 太郎", "7", false, 5, 18, 15, 6, 2, 0, 1, 5, 4, 2, 1, 3, 0, 0, 2, 1, 1);
    var secondRow =
        createBattingStatsRow(
            null, "助っ人A", null, true, 1, 3, 2, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.battingStatsMapper.aggregateBattingStatsByTeamId(10L, 2024, 1L, "completed", true))
        .willReturn(List.of(secondRow, firstRow));

    var responses =
        this.battingStatsService.getBattingStatsByTeamSlug(
            "cats", 2024, 1L, GameStatus.COMPLETED, true, BattingStatsSort.RUNS_BATTED_IN);

    assertEquals("山田 太郎", responses.get(0).displayName());
    assertEquals(5, responses.get(0).runsBattedIn());
    assertEquals("助っ人A", responses.get(1).displayName());
    assertEquals(0, responses.get(1).runsBattedIn());
  }

  @Test
  @DisplayName("getBattingStatsByTeamSlug passes scheduled status to mapper")
  void getBattingStatsByTeamSlug_passesScheduledStatusToMapper() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(
            this.battingStatsMapper.aggregateBattingStatsByTeamId(
                10L, 2024, null, "scheduled", false))
        .willReturn(List.of());

    var responses =
        this.battingStatsService.getBattingStatsByTeamSlug(
            "cats", 2024, null, GameStatus.SCHEDULED, false, BattingStatsSort.HOME_RUNS);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.battingStatsMapper)
        .aggregateBattingStatsByTeamId(10L, 2024, null, "scheduled", false);
    assertEquals(0, responses.size());
  }

  @Test
  @DisplayName("getBattingStatsByTeamSlug returns empty list")
  void getBattingStatsByTeamSlug_returnsEmptyList() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(
            this.battingStatsMapper.aggregateBattingStatsByTeamId(
                10L, null, null, "completed", false))
        .willReturn(List.of());

    var responses =
        this.battingStatsService.getBattingStatsByTeamSlug("cats", null, null, null, null, null);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.battingStatsMapper)
        .aggregateBattingStatsByTeamId(10L, null, null, "completed", false);
    assertEquals(0, responses.size());
  }

  @Test
  @DisplayName("getBattingStatsByTeamSlug calculates zero rates as 0.000")
  void getBattingStatsByTeamSlug_calculatesZeroRatesAsZero() {
    var row =
        createBattingStatsRow(
            1L, "山田 太郎", "7", false, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(
            this.battingStatsMapper.aggregateBattingStatsByTeamId(
                10L, null, null, "completed", false))
        .willReturn(List.of(row));

    var responses =
        this.battingStatsService.getBattingStatsByTeamSlug("cats", null, null, null, false, null);

    assertEquals("0.000", responses.get(0).battingAverage());
    assertEquals("0.000", responses.get(0).onBasePercentage());
    assertEquals("0.000", responses.get(0).sluggingPercentage());
    assertEquals("0.000", responses.get(0).ops());
  }

  @Test
  @DisplayName("getBattingStatsByTeamSlug propagates TeamNotFoundException")
  void getBattingStatsByTeamSlug_propagatesTeamNotFoundException() {
    given(this.teamQueryService.getActiveTeamBySlug("nope"))
        .willThrow(new TeamNotFoundException("nope"));

    var exception =
        assertThrows(
            TeamNotFoundException.class,
            () ->
                this.battingStatsService.getBattingStatsByTeamSlug(
                    "nope", 2024, null, null, null, null));

    verify(this.teamQueryService).getActiveTeamBySlug("nope");
    verify(this.battingStatsMapper, never())
        .aggregateBattingStatsByTeamId(10L, 2024, null, "completed", false);
    assertEquals("TEAM_NOT_FOUND", exception.getCode());
    assertEquals("チームが見つかりません。", exception.getResponseMessage());
  }

  @Test
  @DisplayName("GameStatus.fromValue rejects invalid values")
  void gameStatusFromValue_rejectsInvalidValues() {
    var exception = assertThrows(BadRequestException.class, () -> GameStatus.fromValue("done"));

    assertEquals("INVALID_QUERY_PARAMETER", exception.getCode());
    assertEquals("リクエストパラメータが不正です。", exception.getResponseMessage());
  }

  @Test
  @DisplayName("BattingStatsSort.fromValue rejects invalid values")
  void battingStatsSortFromValue_rejectsInvalidValues() {
    var exception =
        assertThrows(BadRequestException.class, () -> BattingStatsSort.fromValue("unknown"));

    assertEquals("INVALID_QUERY_PARAMETER", exception.getCode());
    assertEquals("リクエストパラメータが不正です。", exception.getResponseMessage());
  }

  private static TeamRow createTeamRow() {
    var teamRow = new TeamRow();
    teamRow.setId(10L);
    teamRow.setSlug("cats");
    teamRow.setName("新琴似CATS");
    teamRow.setShortName("CATS");
    teamRow.setArea("北海道札幌市");
    teamRow.setFoundedYear(2005);
    teamRow.setDescription("札幌市を拠点に活動する草野球チームです。");
    teamRow.setLogoUrl(null);
    teamRow.setMainImageUrl(null);
    teamRow.setActive(true);
    return teamRow;
  }

  private static BattingStatsRow createBattingStatsRow(
      Long playerId,
      String displayName,
      String uniformNumber,
      boolean guest,
      Integer games,
      Integer plateAppearances,
      Integer atBats,
      Integer hits,
      Integer doubles,
      Integer triples,
      Integer homeRuns,
      Integer runsBattedIn,
      Integer runs,
      Integer walks,
      Integer hitByPitch,
      Integer strikeouts,
      Integer sacrificeHits,
      Integer sacrificeFlies,
      Integer stolenBases,
      Integer caughtStealing,
      Integer reachedOnErrors) {
    var row = new BattingStatsRow();
    row.setPlayerId(playerId);
    row.setDisplayName(displayName);
    row.setUniformNumber(uniformNumber);
    row.setGuest(guest);
    row.setGames(games);
    row.setPlateAppearances(plateAppearances);
    row.setAtBats(atBats);
    row.setHits(hits);
    row.setDoubles(doubles);
    row.setTriples(triples);
    row.setHomeRuns(homeRuns);
    row.setRunsBattedIn(runsBattedIn);
    row.setRuns(runs);
    row.setWalks(walks);
    row.setHitByPitch(hitByPitch);
    row.setStrikeouts(strikeouts);
    row.setSacrificeHits(sacrificeHits);
    row.setSacrificeFlies(sacrificeFlies);
    row.setStolenBases(stolenBases);
    row.setCaughtStealing(caughtStealing);
    row.setReachedOnErrors(reachedOnErrors);
    return row;
  }
}
