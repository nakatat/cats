package dev.baseballscore.cats.api.pitchingline;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import dev.baseballscore.cats.api.game.GameNotFoundException;
import dev.baseballscore.cats.api.game.GameQueryService;
import dev.baseballscore.cats.api.game.mapper.model.GameRow;
import dev.baseballscore.cats.api.pitchingline.mapper.PitchingLineMapper;
import dev.baseballscore.cats.api.pitchingline.mapper.model.PitchingLineRow;
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
class PitchingLineServiceTest {

  @Mock private TeamQueryService teamQueryService;

  @Mock private GameQueryService gameQueryService;

  @Mock private PitchingLineMapper pitchingLineMapper;

  @InjectMocks private PitchingLineService pitchingLineService;

  private TeamRow teamRow;

  @BeforeEach
  void setUp() {
    this.teamRow = createTeamRow();
  }

  @Test
  @DisplayName("getPitchingLinesByTeamSlugAndGameId returns pitching lines")
  void getPitchingLinesByTeamSlugAndGameId_returnsPitchingLines() {
    var gameRow = createGameRow(1L);
    var firstRow = createPitchingLineRow(1L, 3L, 1L, 3L, "山田 一郎", "18", 1, false);
    var secondRow = createPitchingLineRow(2L, 10L, 1L, null, "助っ人A", null, 2, true);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.gameQueryService.getGameByTeamIdAndGameId("cats", 10L, 1L)).willReturn(gameRow);
    given(this.pitchingLineMapper.findPitchingLinesByGameIdAndTeamId(10L, 1L))
        .willReturn(List.of(firstRow, secondRow));

    var responses = this.pitchingLineService.getPitchingLinesByTeamSlugAndGameId("cats", 1L);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.gameQueryService).getGameByTeamIdAndGameId("cats", 10L, 1L);
    verify(this.pitchingLineMapper).findPitchingLinesByGameIdAndTeamId(10L, 1L);
    assertEquals(2, responses.size());

    var firstResponse = responses.get(0);
    assertEquals(1L, firstResponse.pitchingLineId());
    assertEquals(3L, firstResponse.gameParticipantId());
    assertEquals(1L, firstResponse.gameId());
    assertEquals(3L, firstResponse.playerId());
    assertEquals("山田 一郎", firstResponse.displayName());
    assertEquals("18", firstResponse.uniformNumber());
    assertEquals(1, firstResponse.pitchingOrder());
    assertEquals(false, firstResponse.guest());
    assertEquals(15, firstResponse.outsPitched());
    assertEquals(22, firstResponse.battersFaced());
    assertEquals(78, firstResponse.pitches());
    assertEquals(4, firstResponse.hitsAllowed());
    assertEquals(0, firstResponse.homeRunsAllowed());
    assertEquals(2, firstResponse.runsAllowed());
    assertEquals(1, firstResponse.earnedRuns());
    assertEquals(2, firstResponse.walks());
    assertEquals(0, firstResponse.hitByPitch());
    assertEquals(5, firstResponse.strikeouts());
    assertEquals(1, firstResponse.wins());
    assertEquals(0, firstResponse.losses());
    assertEquals(0, firstResponse.saves());
    assertEquals(0, firstResponse.holds());

    var secondResponse = responses.get(1);
    assertEquals(2L, secondResponse.pitchingLineId());
    assertEquals(10L, secondResponse.gameParticipantId());
    assertEquals(1L, secondResponse.gameId());
    assertNull(secondResponse.playerId());
    assertEquals("助っ人A", secondResponse.displayName());
    assertNull(secondResponse.uniformNumber());
    assertEquals(2, secondResponse.pitchingOrder());
    assertEquals(true, secondResponse.guest());
    assertEquals(6, secondResponse.outsPitched());
    assertEquals(8, secondResponse.battersFaced());
    assertEquals(28, secondResponse.pitches());
    assertEquals(1, secondResponse.hitsAllowed());
    assertEquals(0, secondResponse.homeRunsAllowed());
    assertEquals(0, secondResponse.runsAllowed());
    assertEquals(0, secondResponse.earnedRuns());
    assertEquals(1, secondResponse.walks());
    assertEquals(0, secondResponse.hitByPitch());
    assertEquals(2, secondResponse.strikeouts());
    assertEquals(0, secondResponse.wins());
    assertEquals(0, secondResponse.losses());
    assertEquals(0, secondResponse.saves());
    assertEquals(0, secondResponse.holds());
  }

  @Test
  @DisplayName("getPitchingLinesByTeamSlugAndGameId returns empty list when no pitching lines")
  void getPitchingLinesByTeamSlugAndGameId_returnsEmptyList() {
    var gameRow = createGameRow(1L);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.gameQueryService.getGameByTeamIdAndGameId("cats", 10L, 1L)).willReturn(gameRow);
    given(this.pitchingLineMapper.findPitchingLinesByGameIdAndTeamId(10L, 1L))
        .willReturn(List.of());

    var responses = this.pitchingLineService.getPitchingLinesByTeamSlugAndGameId("cats", 1L);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.gameQueryService).getGameByTeamIdAndGameId("cats", 10L, 1L);
    verify(this.pitchingLineMapper).findPitchingLinesByGameIdAndTeamId(10L, 1L);
    assertEquals(0, responses.size());
  }

  @Test
  @DisplayName("getPitchingLinesByTeamSlugAndGameId propagates TeamNotFoundException")
  void getPitchingLinesByTeamSlugAndGameId_propagatesTeamNotFoundException() {
    given(this.teamQueryService.getActiveTeamBySlug("nope"))
        .willThrow(new TeamNotFoundException("nope"));

    var exception =
        assertThrows(
            TeamNotFoundException.class,
            () -> this.pitchingLineService.getPitchingLinesByTeamSlugAndGameId("nope", 1L));

    verify(this.teamQueryService).getActiveTeamBySlug("nope");
    verify(this.gameQueryService, never()).getGameByTeamIdAndGameId("nope", 10L, 1L);
    verify(this.pitchingLineMapper, never()).findPitchingLinesByGameIdAndTeamId(10L, 1L);
    assertEquals("TEAM_NOT_FOUND", exception.getCode());
    assertEquals("チームが見つかりません。", exception.getResponseMessage());
  }

  @Test
  @DisplayName("getPitchingLinesByTeamSlugAndGameId throws GameNotFoundException when missing")
  void getPitchingLinesByTeamSlugAndGameId_throwsGameNotFoundExceptionWhenMissing() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.gameQueryService.getGameByTeamIdAndGameId("cats", 10L, 9999L))
        .willThrow(new GameNotFoundException("cats", 9999L));

    var exception =
        assertThrows(
            GameNotFoundException.class,
            () -> this.pitchingLineService.getPitchingLinesByTeamSlugAndGameId("cats", 9999L));

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.gameQueryService).getGameByTeamIdAndGameId("cats", 10L, 9999L);
    verify(this.pitchingLineMapper, never()).findPitchingLinesByGameIdAndTeamId(10L, 9999L);
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

  private static PitchingLineRow createPitchingLineRow(
      Long pitchingLineId,
      Long gameParticipantId,
      Long gameId,
      Long playerId,
      String displayName,
      String uniformNumber,
      Integer pitchingOrder,
      boolean guest) {
    var pitchingLineRow = new PitchingLineRow();
    pitchingLineRow.setPitchingLineId(pitchingLineId);
    pitchingLineRow.setGameParticipantId(gameParticipantId);
    pitchingLineRow.setGameId(gameId);
    pitchingLineRow.setTeamId(10L);
    pitchingLineRow.setPlayerId(playerId);
    pitchingLineRow.setDisplayName(displayName);
    pitchingLineRow.setUniformNumber(uniformNumber);
    pitchingLineRow.setPitchingOrder(pitchingOrder);
    pitchingLineRow.setGuest(guest);
    pitchingLineRow.setOutsPitched(guest ? 6 : 15);
    pitchingLineRow.setBattersFaced(guest ? 8 : 22);
    pitchingLineRow.setPitches(guest ? 28 : 78);
    pitchingLineRow.setHitsAllowed(guest ? 1 : 4);
    pitchingLineRow.setHomeRunsAllowed(0);
    pitchingLineRow.setRunsAllowed(guest ? 0 : 2);
    pitchingLineRow.setEarnedRuns(guest ? 0 : 1);
    pitchingLineRow.setWalks(guest ? 1 : 2);
    pitchingLineRow.setHitByPitch(0);
    pitchingLineRow.setStrikeouts(guest ? 2 : 5);
    pitchingLineRow.setWins(guest ? 0 : 1);
    pitchingLineRow.setLosses(0);
    pitchingLineRow.setSaves(0);
    pitchingLineRow.setHolds(0);
    return pitchingLineRow;
  }
}
