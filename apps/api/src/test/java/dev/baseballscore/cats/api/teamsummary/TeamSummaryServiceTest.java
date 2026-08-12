package dev.baseballscore.cats.api.teamsummary;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import dev.baseballscore.cats.api.common.exception.BadRequestException;
import dev.baseballscore.cats.api.team.SeasonNotFoundException;
import dev.baseballscore.cats.api.team.TeamNotFoundException;
import dev.baseballscore.cats.api.team.TeamQueryService;
import dev.baseballscore.cats.api.team.mapper.model.SeasonRow;
import dev.baseballscore.cats.api.team.mapper.model.TeamRow;
import dev.baseballscore.cats.api.teamsummary.dto.TeamSummaryResponse;
import dev.baseballscore.cats.api.teamsummary.mapper.model.SummaryGameRow;
import dev.baseballscore.cats.api.teamsummary.mapper.model.SummaryRecordRow;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TeamSummaryServiceTest {

  @Mock private TeamQueryService teamQueryService;

  @Mock private TeamSummaryMapper teamSummaryMapper;

  @InjectMocks private TeamSummaryService teamSummaryService;

  @Test
  @DisplayName("getSummaryByTeamSlug uses current season when seasonYear is not specified")
  void getSummary_usesCurrentSeason() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(createTeamRow());
    given(this.teamSummaryMapper.findCurrentSeasonByTeamId(1L))
        .willReturn(createCurrentSeasonRow());
    given(this.teamSummaryMapper.findSummaryRecordByTeamId(1L))
        .willReturn(createSummaryRecordRow());
    given(this.teamSummaryMapper.findRecentGamesBySeasonId(1L, 5))
        .willReturn(List.of(createRecentGameRow()));
    given(this.teamSummaryMapper.findUpcomingGamesBySeasonId(1L, 5))
        .willReturn(List.of(createUpcomingGameRow()));

    var response = this.teamSummaryService.getSummaryByTeamSlug("cats", null, null, null);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.teamSummaryMapper).findCurrentSeasonByTeamId(1L);
    verify(this.teamSummaryMapper).findSummaryRecordByTeamId(1L);
    verify(this.teamSummaryMapper, never()).findSummaryRecordBySeasonId(1L);
    verify(this.teamSummaryMapper, never()).findLatestSeasonByTeamId(1L);
    assertSummaryResponse(response);
  }

  @Test
  @DisplayName("getSummaryByTeamSlug falls back to latest season when current season is missing")
  void getSummary_fallsBackToLatestSeason() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(createTeamRow());
    given(this.teamSummaryMapper.findCurrentSeasonByTeamId(1L)).willReturn(null);
    given(this.teamSummaryMapper.findLatestSeasonByTeamId(1L)).willReturn(createLatestSeasonRow());
    given(this.teamSummaryMapper.findSummaryRecordByTeamId(1L))
        .willReturn(createSummaryRecordRow());
    given(this.teamSummaryMapper.findRecentGamesBySeasonId(2L, 5))
        .willReturn(List.of(createRecentGameRow()));
    given(this.teamSummaryMapper.findUpcomingGamesBySeasonId(2L, 5))
        .willReturn(List.of(createUpcomingGameRow()));

    var response = this.teamSummaryService.getSummaryByTeamSlug("cats", null, null, null);

    verify(this.teamSummaryMapper).findCurrentSeasonByTeamId(1L);
    verify(this.teamSummaryMapper).findLatestSeasonByTeamId(1L);
    verify(this.teamSummaryMapper).findSummaryRecordByTeamId(1L);
    assertEquals(2023, response.season().year());
  }

  @Test
  @DisplayName("getSummaryByTeamSlug uses specified seasonYear")
  void getSummary_usesSpecifiedSeasonYear() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(createTeamRow());
    given(this.teamSummaryMapper.findSeasonByTeamIdAndYear(1L, 2024))
        .willReturn(createSpecifiedSeasonRow());
    given(this.teamSummaryMapper.findSummaryRecordBySeasonId(3L))
        .willReturn(createSummaryRecordRow());
    given(this.teamSummaryMapper.findRecentGamesBySeasonId(3L, 5))
        .willReturn(List.of(createRecentGameRow()));
    given(this.teamSummaryMapper.findUpcomingGamesBySeasonId(3L, 5))
        .willReturn(List.of(createUpcomingGameRow()));

    var response = this.teamSummaryService.getSummaryByTeamSlug("cats", 2024, null, null);

    verify(this.teamSummaryMapper).findSeasonByTeamIdAndYear(1L, 2024);
    verify(this.teamSummaryMapper).findSummaryRecordBySeasonId(3L);
    verify(this.teamSummaryMapper, never()).findSummaryRecordByTeamId(1L);
    verify(this.teamSummaryMapper, never()).findCurrentSeasonByTeamId(1L);
    verify(this.teamSummaryMapper, never()).findLatestSeasonByTeamId(1L);
    assertEquals(2024, response.season().year());
  }

  @Test
  @DisplayName("getSummaryByTeamSlug rejects invalid recentLimit")
  void getSummary_rejectsInvalidRecentLimit() {
    var exception =
        assertThrows(
            BadRequestException.class,
            () -> this.teamSummaryService.getSummaryByTeamSlug("cats", null, 0, 5));

    assertEquals("INVALID_QUERY_PARAMETER", exception.getCode());
    assertEquals("リクエストパラメータが不正です。", exception.getResponseMessage());
  }

  @Test
  @DisplayName("getSummaryByTeamSlug rejects invalid upcomingLimit")
  void getSummary_rejectsInvalidUpcomingLimit() {
    var exception =
        assertThrows(
            BadRequestException.class,
            () -> this.teamSummaryService.getSummaryByTeamSlug("cats", null, 5, 21));

    assertEquals("INVALID_QUERY_PARAMETER", exception.getCode());
    assertEquals("リクエストパラメータが不正です。", exception.getResponseMessage());
  }

  @Test
  @DisplayName("getSummaryByTeamSlug propagates TeamNotFoundException")
  void getSummary_propagatesTeamNotFoundException() {
    given(this.teamQueryService.getActiveTeamBySlug("nope"))
        .willThrow(new TeamNotFoundException("nope"));

    var exception =
        assertThrows(
            TeamNotFoundException.class,
            () -> this.teamSummaryService.getSummaryByTeamSlug("nope", null, null, null));

    verify(this.teamQueryService).getActiveTeamBySlug("nope");
    verifyNoInteractions(this.teamSummaryMapper);
    assertEquals("TEAM_NOT_FOUND", exception.getCode());
    assertEquals("チームが見つかりません。", exception.getResponseMessage());
  }

  @Test
  @DisplayName("getSummaryByTeamSlug throws SeasonNotFoundException when season missing")
  void getSummary_throwsSeasonNotFoundException() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(createTeamRow());
    given(this.teamSummaryMapper.findSeasonByTeamIdAndYear(1L, 2024)).willReturn(null);

    var exception =
        assertThrows(
            SeasonNotFoundException.class,
            () -> this.teamSummaryService.getSummaryByTeamSlug("cats", 2024, null, null));

    assertEquals("SEASON_NOT_FOUND", exception.getCode());
    assertEquals("年度が見つかりません。", exception.getResponseMessage());
  }

  @Test
  @DisplayName("getSummaryByTeamSlug throws SeasonNotFoundException when no season exists")
  void getSummary_throwsSeasonNotFoundExceptionWhenNoSeasonExists() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(createTeamRow());
    given(this.teamSummaryMapper.findCurrentSeasonByTeamId(1L)).willReturn(null);
    given(this.teamSummaryMapper.findLatestSeasonByTeamId(1L)).willReturn(null);

    var exception =
        assertThrows(
            SeasonNotFoundException.class,
            () -> this.teamSummaryService.getSummaryByTeamSlug("cats", null, null, null));

    assertEquals("SEASON_NOT_FOUND", exception.getCode());
    assertEquals("年度が見つかりません。", exception.getResponseMessage());
  }

  private static void assertSummaryResponse(TeamSummaryResponse response) {
    assertEquals("cats", response.team().slug());
    assertEquals(2024, response.season().year());
    assertEquals(10, response.record().games());
    assertEquals("0.667", response.record().winningPercentage());
    assertEquals(10L, response.recentGames().get(0).gameId());
    assertEquals(11L, response.upcomingGames().get(0).gameId());
  }

  private static TeamRow createTeamRow() {
    var teamRow = new TeamRow();
    teamRow.setId(1L);
    teamRow.setSlug("cats");
    teamRow.setName("新琴似CATS");
    teamRow.setShortName("CATS");
    teamRow.setArea("北海道札幌市");
    teamRow.setFoundedYear(2005);
    teamRow.setDescription("札幌市を拠点に活動する草野球チームです。");
    teamRow.setLogoUrl("/images/logo.png");
    teamRow.setMainImageUrl("/images/main.jpg");
    teamRow.setActive(true);
    return teamRow;
  }

  private static SeasonRow createCurrentSeasonRow() {
    var seasonRow = new SeasonRow();
    seasonRow.setId(1L);
    seasonRow.setYear(2024);
    seasonRow.setName("2024年度");
    seasonRow.setStartDate(LocalDate.of(2024, 4, 1));
    seasonRow.setEndDate(LocalDate.of(2024, 11, 30));
    seasonRow.setCurrent(true);
    return seasonRow;
  }

  private static SeasonRow createLatestSeasonRow() {
    var seasonRow = new SeasonRow();
    seasonRow.setId(2L);
    seasonRow.setYear(2023);
    seasonRow.setName("2023年度");
    seasonRow.setStartDate(LocalDate.of(2023, 4, 1));
    seasonRow.setEndDate(LocalDate.of(2023, 11, 30));
    seasonRow.setCurrent(false);
    return seasonRow;
  }

  private static SeasonRow createSpecifiedSeasonRow() {
    var seasonRow = new SeasonRow();
    seasonRow.setId(3L);
    seasonRow.setYear(2024);
    seasonRow.setName("2024年度");
    seasonRow.setStartDate(LocalDate.of(2024, 4, 1));
    seasonRow.setEndDate(LocalDate.of(2024, 11, 30));
    seasonRow.setCurrent(false);
    return seasonRow;
  }

  private static SummaryRecordRow createSummaryRecordRow() {
    var summaryRecordRow = new SummaryRecordRow();
    summaryRecordRow.setGames(10);
    summaryRecordRow.setWins(6);
    summaryRecordRow.setLosses(3);
    summaryRecordRow.setDraws(1);
    summaryRecordRow.setRunsFor(48);
    summaryRecordRow.setRunsAgainst(35);
    return summaryRecordRow;
  }

  private static SummaryGameRow createRecentGameRow() {
    var summaryGameRow = new SummaryGameRow();
    summaryGameRow.setGameId(10L);
    summaryGameRow.setGameDate(LocalDate.of(2024, 10, 20));
    summaryGameRow.setStartTime(LocalTime.of(9, 0));
    summaryGameRow.setOpponentName("札幌ベアーズ");
    summaryGameRow.setStatus("completed");
    summaryGameRow.setResult("win");
    summaryGameRow.setRunsFor(5);
    summaryGameRow.setRunsAgainst(3);
    summaryGameRow.setTournamentId(1L);
    summaryGameRow.setTournamentName("札幌ベースボールリーグ");
    summaryGameRow.setStadiumId(1L);
    summaryGameRow.setStadiumName("新琴似グリーン公園");
    summaryGameRow.setVenueName(null);
    return summaryGameRow;
  }

  private static SummaryGameRow createUpcomingGameRow() {
    var summaryGameRow = new SummaryGameRow();
    summaryGameRow.setGameId(11L);
    summaryGameRow.setGameDate(LocalDate.of(2024, 11, 3));
    summaryGameRow.setStartTime(LocalTime.of(13, 0));
    summaryGameRow.setOpponentName("北区スターズ");
    summaryGameRow.setStatus("scheduled");
    summaryGameRow.setResult(null);
    summaryGameRow.setRunsFor(null);
    summaryGameRow.setRunsAgainst(null);
    summaryGameRow.setTournamentId(null);
    summaryGameRow.setTournamentName(null);
    summaryGameRow.setStadiumId(null);
    summaryGameRow.setStadiumName(null);
    summaryGameRow.setVenueName("未定");
    return summaryGameRow;
  }
}
