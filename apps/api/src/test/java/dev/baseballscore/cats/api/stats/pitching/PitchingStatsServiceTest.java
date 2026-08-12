package dev.baseballscore.cats.api.stats.pitching;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import dev.baseballscore.cats.api.common.exception.BadRequestException;
import dev.baseballscore.cats.api.game.GameStatus;
import dev.baseballscore.cats.api.stats.pitching.mapper.PitchingStatsMapper;
import dev.baseballscore.cats.api.stats.pitching.mapper.model.PitchingStatsRow;
import dev.baseballscore.cats.api.team.TeamNotFoundException;
import dev.baseballscore.cats.api.team.TeamQueryService;
import dev.baseballscore.cats.api.team.mapper.model.TeamRow;
import java.util.List;
import java.util.stream.Stream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PitchingStatsServiceTest {

  @Mock private TeamQueryService teamQueryService;

  @Mock private PitchingStatsMapper pitchingStatsMapper;

  @InjectMocks private PitchingStatsService pitchingStatsService;

  private TeamRow teamRow;

  @BeforeEach
  void setUp() {
    this.teamRow = createTeamRow();
  }

  @Test
  @DisplayName("getPitchingStatsByTeamSlug returns pitching stats")
  void getPitchingStatsByTeamSlug_returnsPitchingStats() {
    var rows = List.of(createPitchingStatsRow(false));
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(
            this.pitchingStatsMapper.aggregatePitchingStatsByTeamId(
                10L, null, null, "completed", false))
        .willReturn(rows);

    var responses =
        this.pitchingStatsService.getPitchingStatsByTeamSlug("cats", null, null, null, null, null);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.pitchingStatsMapper)
        .aggregatePitchingStatsByTeamId(10L, null, null, "completed", false);
    assertEquals(1, responses.size());
    assertEquals("佐藤 一郎", responses.get(0).displayName());
    assertEquals("16回", responses.get(0).inningsPitchedText());
    assertEquals("2.188", responses.get(0).earnedRunAverage());
    assertEquals("1.250", responses.get(0).walksAndHitsPerInningPitched());
    assertEquals("8.750", responses.get(0).strikeoutsPerSevenInnings());
  }

  @ParameterizedTest
  @MethodSource("sortCases")
  @DisplayName("getPitchingStatsByTeamSlug sorts by requested key")
  void getPitchingStatsByTeamSlug_sortsByRequestedKey(
      PitchingStatsSort sort, String expectedFirstDisplayName) {
    var rows = List.of(createPitchingStatsRow(true), createPitchingStatsRow(false));
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(
            this.pitchingStatsMapper.aggregatePitchingStatsByTeamId(
                10L, null, null, "completed", true))
        .willReturn(rows);

    var responses =
        this.pitchingStatsService.getPitchingStatsByTeamSlug(
            "cats", null, null, GameStatus.COMPLETED, true, sort);

    assertEquals(expectedFirstDisplayName, responses.get(0).displayName());
    assertEquals(2, responses.size());
  }

  @Test
  @DisplayName("getPitchingStatsByTeamSlug sorts earnedRunAverage ascending")
  void getPitchingStatsByTeamSlug_sortsEarnedRunAverageAscending() {
    var rows =
        List.of(
            createPitchingStatsRow(1L, "A", false, 21, 3),
            createPitchingStatsRow(2L, "B", false, 21, 1),
            createPitchingStatsRow(3L, "C", false, 21, 5));
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(
            this.pitchingStatsMapper.aggregatePitchingStatsByTeamId(
                10L, null, null, "completed", false))
        .willReturn(rows);

    var responses =
        this.pitchingStatsService.getPitchingStatsByTeamSlug(
            "cats", null, null, GameStatus.COMPLETED, false, PitchingStatsSort.EARNED_RUN_AVERAGE);

    assertEquals("B", responses.get(0).displayName());
    assertEquals("A", responses.get(1).displayName());
    assertEquals("C", responses.get(2).displayName());
  }

  @Test
  @DisplayName("getPitchingStatsByTeamSlug sorts earnedRunAverage with zero outs last")
  void getPitchingStatsByTeamSlug_sortsEarnedRunAverageWithZeroOutsLast() {
    var rows =
        List.of(
            createPitchingStatsRow(1L, "A", false, 21, 3),
            createPitchingStatsRow(2L, "B", false, 0, 0),
            createPitchingStatsRow(3L, "C", false, 21, 1));
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(
            this.pitchingStatsMapper.aggregatePitchingStatsByTeamId(
                10L, null, null, "completed", false))
        .willReturn(rows);

    var responses =
        this.pitchingStatsService.getPitchingStatsByTeamSlug(
            "cats", null, null, GameStatus.COMPLETED, false, PitchingStatsSort.EARNED_RUN_AVERAGE);

    assertEquals("C", responses.get(0).displayName());
    assertEquals("A", responses.get(1).displayName());
    assertEquals("B", responses.get(2).displayName());
  }

  @Test
  @DisplayName("getPitchingStatsByTeamSlug returns empty list")
  void getPitchingStatsByTeamSlug_returnsEmptyList() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(
            this.pitchingStatsMapper.aggregatePitchingStatsByTeamId(
                10L, 2024, 1L, "completed", false))
        .willReturn(List.of());

    var responses =
        this.pitchingStatsService.getPitchingStatsByTeamSlug("cats", 2024, 1L, null, false, null);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.pitchingStatsMapper)
        .aggregatePitchingStatsByTeamId(10L, 2024, 1L, "completed", false);
    assertEquals(0, responses.size());
  }

  @Test
  @DisplayName("getPitchingStatsByTeamSlug calculates zero rates as 0.000")
  void getPitchingStatsByTeamSlug_calculatesZeroRatesAsZero() {
    var row = createPitchingStatsRow(false);
    row.setOutsPitched(0);
    row.setEarnedRuns(0);
    row.setWalks(0);
    row.setHitsAllowed(0);
    row.setStrikeouts(0);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(
            this.pitchingStatsMapper.aggregatePitchingStatsByTeamId(
                10L, null, null, "completed", false))
        .willReturn(List.of(row));

    var responses =
        this.pitchingStatsService.getPitchingStatsByTeamSlug("cats", null, null, null, false, null);

    assertEquals("0.000", responses.get(0).earnedRunAverage());
    assertEquals("0.000", responses.get(0).walksAndHitsPerInningPitched());
    assertEquals("0.000", responses.get(0).strikeoutsPerSevenInnings());
    assertEquals("0回", responses.get(0).inningsPitchedText());
  }

  @Test
  @DisplayName("getPitchingStatsByTeamSlug propagates TeamNotFoundException")
  void getPitchingStatsByTeamSlug_propagatesTeamNotFoundException() {
    given(this.teamQueryService.getActiveTeamBySlug("nope"))
        .willThrow(new TeamNotFoundException("nope"));

    var exception =
        assertThrows(
            TeamNotFoundException.class,
            () ->
                this.pitchingStatsService.getPitchingStatsByTeamSlug(
                    "nope", 2024, null, null, null, null));

    verify(this.teamQueryService).getActiveTeamBySlug("nope");
    verify(this.pitchingStatsMapper, never())
        .aggregatePitchingStatsByTeamId(10L, 2024, null, "completed", false);
    assertEquals("TEAM_NOT_FOUND", exception.getCode());
    assertEquals("チームが見つかりません。", exception.getResponseMessage());
  }

  @Test
  @DisplayName("PitchingStatsSort.fromValue rejects invalid values")
  void pitchingStatsSortFromValue_rejectsInvalidValues() {
    var exception =
        assertThrows(BadRequestException.class, () -> PitchingStatsSort.fromValue("unknown"));

    assertEquals("INVALID_QUERY_PARAMETER", exception.getCode());
    assertEquals("リクエストパラメータが不正です。", exception.getResponseMessage());
  }

  private static Stream<Arguments> sortCases() {
    return Stream.of(
        Arguments.of(null, "佐藤 一郎"),
        Arguments.of(PitchingStatsSort.WINS, "佐藤 一郎"),
        Arguments.of(PitchingStatsSort.STRIKEOUTS, "佐藤 一郎"),
        Arguments.of(PitchingStatsSort.SAVES, "助っ人A"),
        Arguments.of(PitchingStatsSort.HOLDS, "佐藤 一郎"),
        Arguments.of(PitchingStatsSort.OUTS_PITCHED, "佐藤 一郎"),
        Arguments.of(PitchingStatsSort.GAMES, "佐藤 一郎"));
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

  private static PitchingStatsRow createPitchingStatsRow(boolean guest) {
    return createPitchingStatsRow(
        guest ? null : 3L, guest ? "助っ人A" : "佐藤 一郎", guest, guest ? 12 : 48, guest ? 2 : 5);
  }

  private static PitchingStatsRow createPitchingStatsRow(
      Long playerId, String displayName, boolean guest, int outsPitched, int earnedRuns) {
    var row = new PitchingStatsRow();
    row.setPlayerId(playerId);
    row.setDisplayName(displayName);
    row.setUniformNumber(guest ? null : "18");
    row.setGuest(guest);
    row.setGames(guest ? 2 : 4);
    row.setOutsPitched(outsPitched);
    row.setBattersFaced(guest ? 20 : 72);
    row.setPitches(guest ? 60 : 260);
    row.setHitsAllowed(guest ? 3 : 14);
    row.setHomeRunsAllowed(guest ? 0 : 1);
    row.setRunsAllowed(guest ? 2 : 8);
    row.setEarnedRuns(earnedRuns);
    row.setWalks(guest ? 1 : 6);
    row.setHitByPitch(guest ? 0 : 1);
    row.setStrikeouts(guest ? 4 : 20);
    row.setWins(guest ? 1 : 2);
    row.setLosses(guest ? 0 : 1);
    row.setSaves(guest ? 2 : 0);
    row.setHolds(guest ? 0 : 1);
    return row;
  }
}
