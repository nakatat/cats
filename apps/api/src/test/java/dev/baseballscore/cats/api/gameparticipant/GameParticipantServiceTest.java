package dev.baseballscore.cats.api.gameparticipant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import dev.baseballscore.cats.api.game.GameNotFoundException;
import dev.baseballscore.cats.api.game.GameQueryService;
import dev.baseballscore.cats.api.game.mapper.model.GameRow;
import dev.baseballscore.cats.api.gameparticipant.mapper.GameParticipantMapper;
import dev.baseballscore.cats.api.gameparticipant.mapper.model.GameParticipantRow;
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
class GameParticipantServiceTest {

  @Mock private TeamQueryService teamQueryService;

  @Mock private GameQueryService gameQueryService;

  @Mock private GameParticipantMapper gameParticipantMapper;

  @InjectMocks private GameParticipantService gameParticipantService;

  private TeamRow teamRow;

  @BeforeEach
  void setUp() {
    this.teamRow = createTeamRow();
  }

  @Test
  @DisplayName("getParticipantsByTeamSlugAndGameId returns participants")
  void getParticipantsByTeamSlugAndGameId_returnsParticipants() {
    var gameRow = createGameRow(1L);
    var participantRow = createParticipantRow(1L, 1L, 1L, "山田 太郎", "7", 1, "投手", true, false);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.gameQueryService.getGameByTeamIdAndGameId("cats", 10L, 1L)).willReturn(gameRow);
    given(this.gameParticipantMapper.findParticipantsByGameIdAndTeamId(10L, 1L))
        .willReturn(List.of(participantRow));

    var responses = this.gameParticipantService.getParticipantsByTeamSlugAndGameId("cats", 1L);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.gameQueryService).getGameByTeamIdAndGameId("cats", 10L, 1L);
    verify(this.gameParticipantMapper).findParticipantsByGameIdAndTeamId(10L, 1L);
    assertEquals(1, responses.size());

    var response = responses.get(0);
    assertEquals(1L, response.gameParticipantId());
    assertEquals(1L, response.gameId());
    assertEquals(1L, response.playerId());
    assertEquals("山田 太郎", response.displayName());
    assertEquals("7", response.uniformNumber());
    assertEquals(1, response.battingOrder());
    assertEquals("投手", response.position());
    assertEquals(true, response.starter());
    assertEquals(false, response.guest());
  }

  @Test
  @DisplayName("getParticipantsByTeamSlugAndGameId returns empty list when no participants")
  void getParticipantsByTeamSlugAndGameId_returnsEmptyList() {
    var gameRow = createGameRow(1L);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.gameQueryService.getGameByTeamIdAndGameId("cats", 10L, 1L)).willReturn(gameRow);
    given(this.gameParticipantMapper.findParticipantsByGameIdAndTeamId(10L, 1L))
        .willReturn(List.of());

    var responses = this.gameParticipantService.getParticipantsByTeamSlugAndGameId("cats", 1L);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.gameQueryService).getGameByTeamIdAndGameId("cats", 10L, 1L);
    verify(this.gameParticipantMapper).findParticipantsByGameIdAndTeamId(10L, 1L);
    assertEquals(0, responses.size());
  }

  @Test
  @DisplayName("getParticipantsByTeamSlugAndGameId keeps guest playerId null")
  void getParticipantsByTeamSlugAndGameId_keepsGuestPlayerIdNull() {
    var gameRow = createGameRow(1L);
    var participantRow = createParticipantRow(2L, 1L, null, "助っ人A", null, 9, "右翼手", true, true);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.gameQueryService.getGameByTeamIdAndGameId("cats", 10L, 1L)).willReturn(gameRow);
    given(this.gameParticipantMapper.findParticipantsByGameIdAndTeamId(10L, 1L))
        .willReturn(List.of(participantRow));

    var responses = this.gameParticipantService.getParticipantsByTeamSlugAndGameId("cats", 1L);

    assertEquals(1, responses.size());
    var response = responses.get(0);
    assertEquals(null, response.playerId());
    assertEquals(true, response.guest());
    assertEquals("助っ人A", response.displayName());
  }

  @Test
  @DisplayName("getParticipantsByTeamSlugAndGameId propagates TeamNotFoundException")
  void getParticipantsByTeamSlugAndGameId_propagatesTeamNotFoundException() {
    given(this.teamQueryService.getActiveTeamBySlug("nope"))
        .willThrow(new TeamNotFoundException("nope"));

    var exception =
        assertThrows(
            TeamNotFoundException.class,
            () -> this.gameParticipantService.getParticipantsByTeamSlugAndGameId("nope", 1L));

    verify(this.teamQueryService).getActiveTeamBySlug("nope");
    verify(this.gameQueryService, never()).getGameByTeamIdAndGameId("nope", 10L, 1L);
    verify(this.gameParticipantMapper, never()).findParticipantsByGameIdAndTeamId(10L, 1L);
    assertEquals("TEAM_NOT_FOUND", exception.getCode());
    assertEquals("チームが見つかりません。", exception.getResponseMessage());
    assertEquals("Team not found: nope", exception.getMessage());
  }

  @Test
  @DisplayName("getParticipantsByTeamSlugAndGameId throws GameNotFoundException when missing")
  void getParticipantsByTeamSlugAndGameId_throwsGameNotFoundExceptionWhenMissing() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.gameQueryService.getGameByTeamIdAndGameId("cats", 10L, 9999L))
        .willThrow(new GameNotFoundException("cats", 9999L));

    var exception =
        assertThrows(
            GameNotFoundException.class,
            () -> this.gameParticipantService.getParticipantsByTeamSlugAndGameId("cats", 9999L));

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.gameQueryService).getGameByTeamIdAndGameId("cats", 10L, 9999L);
    verify(this.gameParticipantMapper, never()).findParticipantsByGameIdAndTeamId(10L, 9999L);
    assertEquals("GAME_NOT_FOUND", exception.getCode());
    assertEquals("試合が見つかりません。", exception.getResponseMessage());
    assertEquals("Game not found: teamSlug=cats, gameId=9999", exception.getMessage());
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

  private static GameRow createGameRow(Long id) {
    var gameRow = new GameRow();
    gameRow.setId(id);
    gameRow.setTeamId(10L);
    gameRow.setSeasonId(1L);
    gameRow.setSeasonYear(2024);
    gameRow.setTournamentId(1L);
    gameRow.setTournamentName("札幌ベースボールリーグ");
    gameRow.setStadiumId(1L);
    gameRow.setStadiumName("新琴似グリーン公園");
    gameRow.setGameDate(LocalDate.of(2024, 5, 12));
    gameRow.setStartTime(LocalTime.of(9, 0));
    gameRow.setOpponentName("札幌ベアーズ");
    gameRow.setHomeAway("home");
    gameRow.setGameType("official");
    gameRow.setStatus("completed");
    gameRow.setRunsFor(5);
    gameRow.setRunsAgainst(3);
    gameRow.setResult("win");
    gameRow.setVenueName(null);
    gameRow.setNote("開幕戦");
    return gameRow;
  }

  private static GameParticipantRow createParticipantRow(
      Long gameParticipantId,
      Long gameId,
      Long playerId,
      String displayName,
      String uniformNumber,
      Integer battingOrder,
      String position,
      boolean starter,
      boolean guest) {
    var gameParticipantRow = new GameParticipantRow();
    gameParticipantRow.setGameParticipantId(gameParticipantId);
    gameParticipantRow.setGameId(gameId);
    gameParticipantRow.setPlayerId(playerId);
    gameParticipantRow.setDisplayName(displayName);
    gameParticipantRow.setUniformNumber(uniformNumber);
    gameParticipantRow.setBattingOrder(battingOrder);
    gameParticipantRow.setPosition(position);
    gameParticipantRow.setStarter(starter);
    gameParticipantRow.setGuest(guest);
    return gameParticipantRow;
  }
}
