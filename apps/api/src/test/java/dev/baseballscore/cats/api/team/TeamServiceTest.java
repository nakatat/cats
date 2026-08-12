package dev.baseballscore.cats.api.team;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import dev.baseballscore.cats.api.team.mapper.TeamMapper;
import dev.baseballscore.cats.api.team.mapper.model.SeasonRow;
import dev.baseballscore.cats.api.team.mapper.model.TeamRow;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

  @Mock private TeamQueryService teamQueryService;

  @Mock private TeamMapper teamMapper;

  @InjectMocks private TeamService teamService;

  private TeamRow teamRow;

  @BeforeEach
  void setUp() {
    this.teamRow = createTeamRow();
  }

  @Test
  @DisplayName("getTeamBySlug returns team info")
  void getTeamBySlug_returnsTeamInfo() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);

    var response = this.teamService.getTeamBySlug("cats");

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.teamMapper, never()).findSeasonsByTeamId(10L);
    assertEquals(10L, response.id());
    assertEquals("cats", response.slug());
    assertEquals("新琴似CATS", response.name());
    assertEquals("CATS", response.shortName());
    assertEquals("北海道札幌市", response.area());
    assertEquals(2005, response.foundedYear());
    assertEquals("札幌市を拠点に活動する草野球チームです。", response.description());
    assertEquals(null, response.logoUrl());
    assertEquals(null, response.mainImageUrl());
    assertEquals(true, response.isActive());
  }

  @Test
  @DisplayName("getSeasonsByTeamSlug returns seasons")
  void getSeasonsByTeamSlug_returnsSeasons() {
    var seasonRow = createSeasonRow();
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.teamMapper.findSeasonsByTeamId(10L)).willReturn(List.of(seasonRow));

    var responses = this.teamService.getSeasonsByTeamSlug("cats");

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.teamMapper).findSeasonsByTeamId(10L);
    assertEquals(1, responses.size());

    var response = responses.get(0);
    assertEquals(1L, response.id());
    assertEquals(2024, response.year());
    assertEquals("2024年度", response.name());
    assertEquals(LocalDate.of(2024, 1, 1), response.startDate());
    assertEquals(LocalDate.of(2024, 12, 31), response.endDate());
    assertEquals(true, response.isCurrent());
  }

  @Test
  @DisplayName("getSeasonsByTeamSlug returns empty list when season is missing")
  void getSeasonsByTeamSlug_returnsEmptyListWhenSeasonMissing() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.teamMapper.findSeasonsByTeamId(10L)).willReturn(List.of());

    var responses = this.teamService.getSeasonsByTeamSlug("cats");

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.teamMapper).findSeasonsByTeamId(10L);
    assertEquals(0, responses.size());
  }

  @Test
  @DisplayName("getTeamBySlug propagates TeamNotFoundException")
  void getTeamBySlug_propagatesTeamNotFoundException() {
    given(this.teamQueryService.getActiveTeamBySlug("nope"))
        .willThrow(new TeamNotFoundException("nope"));

    var exception =
        assertThrows(TeamNotFoundException.class, () -> this.teamService.getTeamBySlug("nope"));

    verify(this.teamQueryService).getActiveTeamBySlug("nope");
    verify(this.teamMapper, never()).findSeasonsByTeamId(10L);
    assertEquals("TEAM_NOT_FOUND", exception.getCode());
    assertEquals("チームが見つかりません。", exception.getResponseMessage());
    assertEquals("Team not found: nope", exception.getMessage());
  }

  @Test
  @DisplayName("getSeasonsByTeamSlug propagates TeamNotFoundException")
  void getSeasonsByTeamSlug_propagatesTeamNotFoundException() {
    given(this.teamQueryService.getActiveTeamBySlug("nope"))
        .willThrow(new TeamNotFoundException("nope"));

    var exception =
        assertThrows(
            TeamNotFoundException.class, () -> this.teamService.getSeasonsByTeamSlug("nope"));

    verify(this.teamQueryService).getActiveTeamBySlug("nope");
    verify(this.teamMapper, never()).findSeasonsByTeamId(10L);
    assertEquals("TEAM_NOT_FOUND", exception.getCode());
    assertEquals("チームが見つかりません。", exception.getResponseMessage());
    assertEquals("Team not found: nope", exception.getMessage());
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

  private static SeasonRow createSeasonRow() {
    var seasonRow = new SeasonRow();
    seasonRow.setId(1L);
    seasonRow.setYear(2024);
    seasonRow.setName("2024年度");
    seasonRow.setStartDate(LocalDate.of(2024, 1, 1));
    seasonRow.setEndDate(LocalDate.of(2024, 12, 31));
    seasonRow.setCurrent(true);
    return seasonRow;
  }
}
