package dev.baseballscore.cats.api.tournament;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import dev.baseballscore.cats.api.team.TeamNotFoundException;
import dev.baseballscore.cats.api.team.TeamQueryService;
import dev.baseballscore.cats.api.team.mapper.model.TeamRow;
import dev.baseballscore.cats.api.tournament.mapper.TournamentMapper;
import dev.baseballscore.cats.api.tournament.mapper.model.TournamentRow;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TournamentServiceTest {

  @Mock private TeamQueryService teamQueryService;

  @Mock private TournamentMapper tournamentMapper;

  @InjectMocks private TournamentService tournamentService;

  private TeamRow teamRow;

  @BeforeEach
  void setUp() {
    this.teamRow = createTeamRow();
  }

  @Test
  @DisplayName("getTournamentsByTeamSlug returns tournaments")
  void getTournamentsByTeamSlug_returnsTournaments() {
    var firstRow = createTournamentRow(1L, 1, 2024);
    var secondRow = createTournamentRow(2L, 2, 2025);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.tournamentMapper.findTournamentsByTeamId(10L))
        .willReturn(List.of(firstRow, secondRow));

    var responses = this.tournamentService.getTournamentsByTeamSlug("cats");

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.tournamentMapper).findTournamentsByTeamId(10L);
    assertEquals(2, responses.size());

    var firstResponse = responses.get(0);
    assertEquals(1L, firstResponse.tournamentId());
    assertEquals("札幌ベースボールリーグ", firstResponse.name());
    assertEquals("SBL", firstResponse.shortName());
    assertEquals(2024, firstResponse.seasonYear());
    assertEquals("札幌市内の草野球リーグです。", firstResponse.description());
    assertEquals(1, firstResponse.displayOrder());

    var secondResponse = responses.get(1);
    assertEquals(2L, secondResponse.tournamentId());
    assertEquals("北区大会", secondResponse.name());
    assertEquals("北区", secondResponse.shortName());
    assertEquals(2025, secondResponse.seasonYear());
    assertEquals("北区を中心に開催される大会です。", secondResponse.description());
    assertEquals(2, secondResponse.displayOrder());
  }

  @Test
  @DisplayName("getTournamentByTeamSlugAndTournamentId returns tournament detail")
  void getTournamentByTeamSlugAndTournamentId_returnsTournamentDetail() {
    var tournamentRow = createTournamentRow(1L, 1, 2024);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.tournamentMapper.findTournamentByTeamIdAndTournamentId(10L, 1L))
        .willReturn(tournamentRow);

    var response = this.tournamentService.getTournamentByTeamSlugAndTournamentId("cats", 1L);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.tournamentMapper).findTournamentByTeamIdAndTournamentId(10L, 1L);
    assertEquals(1L, response.tournamentId());
    assertEquals("札幌ベースボールリーグ", response.name());
    assertEquals("SBL", response.shortName());
    assertEquals(2024, response.seasonYear());
    assertEquals("札幌市内の草野球リーグです。", response.description());
    assertEquals(1, response.displayOrder());
  }

  @Test
  @DisplayName("getTournamentsByTeamSlug propagates TeamNotFoundException")
  void getTournamentsByTeamSlug_propagatesTeamNotFoundException() {
    given(this.teamQueryService.getActiveTeamBySlug("nope"))
        .willThrow(new TeamNotFoundException("nope"));

    var exception =
        assertThrows(
            TeamNotFoundException.class,
            () -> this.tournamentService.getTournamentsByTeamSlug("nope"));

    verify(this.teamQueryService).getActiveTeamBySlug("nope");
    verify(this.tournamentMapper, never()).findTournamentsByTeamId(10L);
    assertEquals("TEAM_NOT_FOUND", exception.getCode());
    assertEquals("チームが見つかりません。", exception.getResponseMessage());
    assertEquals("Team not found: nope", exception.getMessage());
  }

  @Test
  @DisplayName(
      "getTournamentByTeamSlugAndTournamentId throws TournamentNotFoundException when missing")
  void getTournamentByTeamSlugAndTournamentId_throwsTournamentNotFoundExceptionWhenMissing() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.tournamentMapper.findTournamentByTeamIdAndTournamentId(10L, 9999L)).willReturn(null);

    var exception =
        assertThrows(
            TournamentNotFoundException.class,
            () -> this.tournamentService.getTournamentByTeamSlugAndTournamentId("cats", 9999L));

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.tournamentMapper).findTournamentByTeamIdAndTournamentId(10L, 9999L);
    assertEquals("TOURNAMENT_NOT_FOUND", exception.getCode());
    assertEquals("大会が見つかりません。", exception.getResponseMessage());
    assertEquals("Tournament not found: teamSlug=cats, tournamentId=9999", exception.getMessage());
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

  private static TournamentRow createTournamentRow(Long id, int displayOrder, int seasonYear) {
    var tournamentRow = new TournamentRow();
    tournamentRow.setId(id);
    tournamentRow.setTeamId(10L);
    tournamentRow.setName(id == 1L ? "札幌ベースボールリーグ" : "北区大会");
    tournamentRow.setShortName(id == 1L ? "SBL" : "北区");
    tournamentRow.setSeasonYear(seasonYear);
    tournamentRow.setDescription(id == 1L ? "札幌市内の草野球リーグです。" : "北区を中心に開催される大会です。");
    tournamentRow.setDisplayOrder(displayOrder);
    return tournamentRow;
  }
}
