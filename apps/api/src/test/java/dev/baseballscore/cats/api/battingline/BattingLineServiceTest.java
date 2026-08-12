package dev.baseballscore.cats.api.battingline;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import dev.baseballscore.cats.api.battingline.mapper.BattingLineMapper;
import dev.baseballscore.cats.api.battingline.mapper.model.BattingLineRow;
import dev.baseballscore.cats.api.game.GameNotFoundException;
import dev.baseballscore.cats.api.game.GameQueryService;
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
class BattingLineServiceTest {

  @Mock private TeamQueryService teamQueryService;

  @Mock private GameQueryService gameQueryService;

  @Mock private BattingLineMapper battingLineMapper;

  @InjectMocks private BattingLineService battingLineService;

  private TeamRow teamRow;

  @BeforeEach
  void setUp() {
    this.teamRow = createTeamRow();
  }

  @Test
  @DisplayName("getBattingLinesByTeamSlugAndGameId returns batting lines")
  void getBattingLinesByTeamSlugAndGameId_returnsBattingLines() {
    var gameRow = createGameRow(1L);
    var firstRow = createBattingLineRow(1L, 1L, 1L, 1L, "山田 太郎", "7", 1, "遊撃手", false);
    var secondRow = createBattingLineRow(2L, 2L, 1L, null, "助っ人A", null, 9, "右翼手", true);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.gameQueryService.getGameByTeamIdAndGameId("cats", 10L, 1L)).willReturn(gameRow);
    given(this.battingLineMapper.findBattingLinesByGameIdAndTeamId(10L, 1L))
        .willReturn(List.of(firstRow, secondRow));

    var responses = this.battingLineService.getBattingLinesByTeamSlugAndGameId("cats", 1L);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.gameQueryService).getGameByTeamIdAndGameId("cats", 10L, 1L);
    verify(this.battingLineMapper).findBattingLinesByGameIdAndTeamId(10L, 1L);
    assertEquals(2, responses.size());

    var firstResponse = responses.get(0);
    assertEquals(1L, firstResponse.battingLineId());
    assertEquals(1L, firstResponse.gameParticipantId());
    assertEquals(1L, firstResponse.gameId());
    assertEquals(1L, firstResponse.playerId());
    assertEquals("山田 太郎", firstResponse.displayName());
    assertEquals("7", firstResponse.uniformNumber());
    assertEquals(1, firstResponse.battingOrder());
    assertEquals("遊撃手", firstResponse.position());
    assertEquals(false, firstResponse.guest());
    assertEquals(4, firstResponse.plateAppearances());
    assertEquals(2, firstResponse.hits());
    assertEquals(1, firstResponse.runsBattedIn());
    assertEquals(0, firstResponse.sacrificeHits());
    assertEquals(0, firstResponse.sacrificeFlies());
    assertEquals(1, firstResponse.stolenBases());
    assertEquals(0, firstResponse.caughtStealing());
    assertEquals(0, firstResponse.reachedOnErrors());

    var secondResponse = responses.get(1);
    assertEquals(2L, secondResponse.battingLineId());
    assertEquals(2L, secondResponse.gameParticipantId());
    assertEquals(1L, secondResponse.gameId());
    assertNull(secondResponse.playerId());
    assertEquals("助っ人A", secondResponse.displayName());
    assertNull(secondResponse.uniformNumber());
    assertEquals(9, secondResponse.battingOrder());
    assertEquals("右翼手", secondResponse.position());
    assertEquals(true, secondResponse.guest());
    assertEquals(1, secondResponse.caughtStealing());
    assertEquals(1, secondResponse.reachedOnErrors());
  }

  @Test
  @DisplayName("getBattingLinesByTeamSlugAndGameId returns empty list when no batting lines")
  void getBattingLinesByTeamSlugAndGameId_returnsEmptyList() {
    var gameRow = createGameRow(1L);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.gameQueryService.getGameByTeamIdAndGameId("cats", 10L, 1L)).willReturn(gameRow);
    given(this.battingLineMapper.findBattingLinesByGameIdAndTeamId(10L, 1L)).willReturn(List.of());

    var responses = this.battingLineService.getBattingLinesByTeamSlugAndGameId("cats", 1L);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.gameQueryService).getGameByTeamIdAndGameId("cats", 10L, 1L);
    verify(this.battingLineMapper).findBattingLinesByGameIdAndTeamId(10L, 1L);
    assertEquals(0, responses.size());
  }

  @Test
  @DisplayName("getBattingLinesByTeamSlugAndGameId propagates TeamNotFoundException")
  void getBattingLinesByTeamSlugAndGameId_propagatesTeamNotFoundException() {
    given(this.teamQueryService.getActiveTeamBySlug("nope"))
        .willThrow(new TeamNotFoundException("nope"));

    var exception =
        assertThrows(
            TeamNotFoundException.class,
            () -> this.battingLineService.getBattingLinesByTeamSlugAndGameId("nope", 1L));

    verify(this.teamQueryService).getActiveTeamBySlug("nope");
    verify(this.gameQueryService, never()).getGameByTeamIdAndGameId("nope", 10L, 1L);
    verify(this.battingLineMapper, never()).findBattingLinesByGameIdAndTeamId(10L, 1L);
    assertEquals("TEAM_NOT_FOUND", exception.getCode());
    assertEquals("チームが見つかりません。", exception.getResponseMessage());
  }

  @Test
  @DisplayName("getBattingLinesByTeamSlugAndGameId throws GameNotFoundException when missing")
  void getBattingLinesByTeamSlugAndGameId_throwsGameNotFoundExceptionWhenMissing() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.gameQueryService.getGameByTeamIdAndGameId("cats", 10L, 9999L))
        .willThrow(new GameNotFoundException("cats", 9999L));

    var exception =
        assertThrows(
            GameNotFoundException.class,
            () -> this.battingLineService.getBattingLinesByTeamSlugAndGameId("cats", 9999L));

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.gameQueryService).getGameByTeamIdAndGameId("cats", 10L, 9999L);
    verify(this.battingLineMapper, never()).findBattingLinesByGameIdAndTeamId(10L, 9999L);
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

  private static BattingLineRow createBattingLineRow(
      Long battingLineId,
      Long gameParticipantId,
      Long gameId,
      Long playerId,
      String displayName,
      String uniformNumber,
      Integer battingOrder,
      String position,
      boolean guest) {
    var battingLineRow = new BattingLineRow();
    battingLineRow.setBattingLineId(battingLineId);
    battingLineRow.setGameParticipantId(gameParticipantId);
    battingLineRow.setGameId(gameId);
    battingLineRow.setTeamId(10L);
    battingLineRow.setPlayerId(playerId);
    battingLineRow.setDisplayName(displayName);
    battingLineRow.setUniformNumber(uniformNumber);
    battingLineRow.setBattingOrder(battingOrder);
    battingLineRow.setPosition(position);
    battingLineRow.setGuest(guest);
    battingLineRow.setPlateAppearances(4);
    battingLineRow.setAtBats(4);
    battingLineRow.setHits(2);
    battingLineRow.setDoubles(1);
    battingLineRow.setTriples(0);
    battingLineRow.setHomeRuns(0);
    battingLineRow.setRunsBattedIn(1);
    battingLineRow.setRuns(1);
    battingLineRow.setWalks(0);
    battingLineRow.setHitByPitch(0);
    battingLineRow.setStrikeouts(1);
    battingLineRow.setStolenBases(1);
    battingLineRow.setSacrificeHits(0);
    battingLineRow.setSacrificeFlies(0);
    battingLineRow.setCaughtStealing(guest ? 1 : 0);
    battingLineRow.setReachedOnErrors(guest ? 1 : 0);
    return battingLineRow;
  }
}
