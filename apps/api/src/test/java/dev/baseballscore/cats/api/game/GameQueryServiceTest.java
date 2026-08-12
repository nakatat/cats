package dev.baseballscore.cats.api.game;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import dev.baseballscore.cats.api.game.mapper.GameMapper;
import dev.baseballscore.cats.api.game.mapper.model.GameRow;
import java.time.LocalDate;
import java.time.LocalTime;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GameQueryServiceTest {

  @Mock private GameMapper gameMapper;

  @InjectMocks private GameQueryService gameQueryService;

  @Test
  @DisplayName("getGameByTeamIdAndGameId returns game")
  void getGameByTeamIdAndGameId_returnsGame() {
    var gameRow = createGameRow(1L);
    given(this.gameMapper.findGameByTeamIdAndGameId(10L, 1L)).willReturn(gameRow);

    var result = this.gameQueryService.getGameByTeamIdAndGameId("cats", 10L, 1L);

    verify(this.gameMapper).findGameByTeamIdAndGameId(10L, 1L);
    assertEquals(1L, result.getId());
    assertEquals("札幌ベアーズ", result.getOpponentName());
  }

  @Test
  @DisplayName("getGameByTeamIdAndGameId throws GameNotFoundException when missing")
  void getGameByTeamIdAndGameId_throwsGameNotFoundExceptionWhenMissing() {
    given(this.gameMapper.findGameByTeamIdAndGameId(10L, 9999L)).willReturn(null);

    var exception =
        assertThrows(
            GameNotFoundException.class,
            () -> this.gameQueryService.getGameByTeamIdAndGameId("cats", 10L, 9999L));

    verify(this.gameMapper).findGameByTeamIdAndGameId(10L, 9999L);
    assertEquals("GAME_NOT_FOUND", exception.getCode());
    assertEquals("試合が見つかりません。", exception.getResponseMessage());
    assertEquals("Game not found: teamSlug=cats, gameId=9999", exception.getMessage());
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
}
