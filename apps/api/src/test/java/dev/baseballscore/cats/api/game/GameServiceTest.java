package dev.baseballscore.cats.api.game;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import dev.baseballscore.cats.api.game.mapper.GameMapper;
import dev.baseballscore.cats.api.game.mapper.model.GameRow;
import dev.baseballscore.cats.api.team.TeamNotFoundException;
import dev.baseballscore.cats.api.team.TeamQueryService;
import dev.baseballscore.cats.api.team.mapper.model.TeamRow;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GameServiceTest {

  @Mock private TeamQueryService teamQueryService;

  @Mock private GameMapper gameMapper;

  @InjectMocks private GameService gameService;

  private TeamRow teamRow;

  @BeforeEach
  void setUp() {
    this.teamRow = createTeamRow();
  }

  @Test
  @DisplayName("getGamesByTeamSlug returns games")
  void getGamesByTeamSlug_returnsGames() {
    var firstRow = createGameRow(1L, 2024, "completed");
    var secondRow = createGameRow(2L, 2024, "completed");
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.gameMapper.findGamesByTeamId(10L, 2024, "completed"))
        .willReturn(List.of(firstRow, secondRow));

    var responses = this.gameService.getGamesByTeamSlug("cats", 2024, "completed");

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.gameMapper).findGamesByTeamId(10L, 2024, "completed");
    assertEquals(2, responses.size());
    assertEquals(1L, responses.get(0).gameId());
    assertEquals(2L, responses.get(1).gameId());
    assertEquals("completed", responses.get(0).status());
  }

  @Test
  @DisplayName("getGamesByTeamSlug returns empty list when no games")
  void getGamesByTeamSlug_returnsEmptyList() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.gameMapper.findGamesByTeamId(10L, null, null)).willReturn(List.of());

    var responses = this.gameService.getGamesByTeamSlug("cats", null, null);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.gameMapper).findGamesByTeamId(10L, null, null);
    assertEquals(0, responses.size());
  }

  @Test
  @DisplayName("getGameByTeamSlugAndGameId returns game detail")
  void getGameByTeamSlugAndGameId_returnsGameDetail() {
    var gameRow = createGameRow(1L, 2024, "completed");
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.gameMapper.findGameByTeamIdAndGameId(10L, 1L)).willReturn(gameRow);

    var response = this.gameService.getGameByTeamSlugAndGameId("cats", 1L);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.gameMapper).findGameByTeamIdAndGameId(10L, 1L);
    assertEquals(1L, response.gameId());
    assertEquals("札幌ベアーズ", response.opponentName());
    assertEquals(5, response.runsFor());
    assertEquals(3, response.runsAgainst());
    assertEquals("win", response.result());
  }

  @Test
  @DisplayName("getGameByTeamSlugAndGameId throws GameNotFoundException when missing")
  void getGameByTeamSlugAndGameId_throwsGameNotFoundExceptionWhenMissing() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.gameMapper.findGameByTeamIdAndGameId(10L, 9999L)).willReturn(null);

    var exception =
        assertThrows(
            GameNotFoundException.class,
            () -> this.gameService.getGameByTeamSlugAndGameId("cats", 9999L));

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.gameMapper).findGameByTeamIdAndGameId(10L, 9999L);
    assertEquals("GAME_NOT_FOUND", exception.getCode());
    assertEquals("試合が見つかりません。", exception.getResponseMessage());
    assertEquals("Game not found: teamSlug=cats, gameId=9999", exception.getMessage());
  }

  @Test
  @DisplayName("getGamesByTeamSlug propagates TeamNotFoundException")
  void getGamesByTeamSlug_propagatesTeamNotFoundException() {
    given(this.teamQueryService.getActiveTeamBySlug("nope"))
        .willThrow(new TeamNotFoundException("nope"));

    var exception =
        assertThrows(
            TeamNotFoundException.class,
            () -> this.gameService.getGamesByTeamSlug("nope", null, null));

    verify(this.teamQueryService).getActiveTeamBySlug("nope");
    verify(this.gameMapper, never()).findGamesByTeamId(10L, null, null);
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

  private static GameRow createGameRow(Long id, Integer seasonYear, String status) {
    var gameRow = new GameRow();
    gameRow.setId(id);
    gameRow.setTeamId(10L);
    gameRow.setSeasonId(1L);
    gameRow.setSeasonYear(seasonYear);
    gameRow.setTournamentId(1L);
    gameRow.setTournamentName("札幌ベースボールリーグ");
    gameRow.setStadiumId(1L);
    gameRow.setStadiumName("新琴似グリーン公園");
    gameRow.setGameDate(LocalDate.of(2024, 5, 12));
    gameRow.setStartTime(LocalTime.of(9, 0));
    gameRow.setOpponentName("札幌ベアーズ");
    gameRow.setHomeAway("home");
    gameRow.setGameType("official");
    gameRow.setStatus(status);
    gameRow.setRunsFor(5);
    gameRow.setRunsAgainst(3);
    gameRow.setResult("win");
    gameRow.setVenueName(null);
    gameRow.setNote("開幕戦");
    return gameRow;
  }
}
