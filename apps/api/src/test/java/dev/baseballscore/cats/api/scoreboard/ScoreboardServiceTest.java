package dev.baseballscore.cats.api.scoreboard;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import dev.baseballscore.cats.api.game.GameQueryService;
import dev.baseballscore.cats.api.game.InningScoreStatus;
import dev.baseballscore.cats.api.game.mapper.model.GameRow;
import dev.baseballscore.cats.api.scoreboard.dto.ScoreboardInningResponse;
import dev.baseballscore.cats.api.scoreboard.mapper.ScoreboardMapper;
import dev.baseballscore.cats.api.scoreboard.mapper.model.ScoreboardRow;
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
class ScoreboardServiceTest {

  @Mock private TeamQueryService teamQueryService;

  @Mock private GameQueryService gameQueryService;

  @Mock private ScoreboardMapper scoreboardMapper;

  @InjectMocks private ScoreboardService scoreboardService;

  private TeamRow teamRow;
  private GameRow gameRow;

  @BeforeEach
  void setUp() {
    this.teamRow = new TeamRow();
    this.teamRow.setId(10L);
    this.teamRow.setSlug("cats");

    this.gameRow = new GameRow();
    this.gameRow.setId(1L);
    this.gameRow.setInningScoreStatus("complete");
  }

  @Test
  @DisplayName("getScoreboardByTeamSlugAndGameId returns played innings in display order")
  void getScoreboardByTeamSlugAndGameId_returnsPlayedInningsInDisplayOrder() {
    givenTeamAndGame();
    given(this.scoreboardMapper.findScoreboardRowsByGameId(1L))
        .willReturn(
            List.of(
                createRow(2L, null, "札幌ベアーズ", true, 1, 1, 0, "played", 1, 4, 0),
                createRow(1L, 10L, "新琴似CATS", false, 0, 2, 1, "played", 1, 5, 1),
                createRow(1L, 10L, "新琴似CATS", false, 0, 1, 0, "played", 1, 5, 1),
                createRow(2L, null, "札幌ベアーズ", true, 2, 2, 0, "played", 2, 4, 0)));

    var response = this.scoreboardService.getScoreboardByTeamSlugAndGameId("cats", 1L);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.gameQueryService).getGameByTeamIdAndGameId("cats", 10L, 1L);
    verify(this.scoreboardMapper).findScoreboardRowsByGameId(1L);
    assertEquals(InningScoreStatus.COMPLETE, response.status());
    assertEquals(2, response.rows().size());
    assertEquals(1L, response.rows().get(0).scoreLineId());
    assertEquals(
        List.of(
            new ScoreboardInningResponse(1, 0, InningStatus.PLAYED),
            new ScoreboardInningResponse(2, 1, InningStatus.PLAYED)),
        response.rows().get(0).innings());
    assertEquals(2L, response.rows().get(1).scoreLineId());
  }

  @Test
  @DisplayName("not_batted inning keeps null runs and does not throw")
  void getScoreboardByTeamSlugAndGameId_returnsNotBattedInning() {
    givenTeamAndGame();
    given(this.scoreboardMapper.findScoreboardRowsByGameId(1L))
        .willReturn(
            List.of(
                createRow(1L, 10L, "新琴似CATS", false, 0, 1, 1, "played", 0, 5, 1),
                createRow(1L, 10L, "新琴似CATS", false, 0, 2, null, "not_batted", 0, 5, 1),
                createRow(2L, null, "札幌ベアーズ", true, 1, 1, 0, "played", 1, 4, 0)));

    var response = this.scoreboardService.getScoreboardByTeamSlugAndGameId("cats", 1L);

    assertEquals(
        new ScoreboardInningResponse(2, null, InningStatus.NOT_BATTED),
        response.rows().get(0).innings().get(1));
  }

  @Test
  @DisplayName("unregistered game without score lines returns status and empty rows")
  void getScoreboardByTeamSlugAndGameId_returnsUnregisteredStatusWithoutRows() {
    givenTeamAndGame();
    this.gameRow.setInningScoreStatus("unregistered");
    given(this.scoreboardMapper.findScoreboardRowsByGameId(1L)).willReturn(List.of());

    var response = this.scoreboardService.getScoreboardByTeamSlugAndGameId("cats", 1L);

    assertEquals(InningScoreStatus.UNREGISTERED, response.status());
    assertEquals(List.of(), response.rows());
  }

  @Test
  @DisplayName("draft status is returned without score lines")
  void getScoreboardByTeamSlugAndGameId_returnsDraftStatusWithoutRows() {
    givenTeamAndGame();
    this.gameRow.setInningScoreStatus("draft");
    given(this.scoreboardMapper.findScoreboardRowsByGameId(1L)).willReturn(List.of());

    var response = this.scoreboardService.getScoreboardByTeamSlugAndGameId("cats", 1L);

    assertEquals(InningScoreStatus.DRAFT, response.status());
    assertEquals(List.of(), response.rows());
  }

  @Test
  @DisplayName("score line without inning rows is returned with empty innings")
  void getScoreboardByTeamSlugAndGameId_returnsScoreLineWithoutInnings() {
    givenTeamAndGame();
    given(this.scoreboardMapper.findScoreboardRowsByGameId(1L))
        .willReturn(List.of(createRow(1L, 10L, "新琴似CATS", false, 0, null, null, null, 1, 5, 1)));

    var response = this.scoreboardService.getScoreboardByTeamSlugAndGameId("cats", 1L);

    assertEquals(1, response.rows().size());
    assertEquals(List.of(), response.rows().get(0).innings());
  }

  @Test
  @DisplayName("getScoreboardByTeamSlugAndGameId does not query scores when team lookup fails")
  void getScoreboardByTeamSlugAndGameId_doesNotQueryScoresWhenTeamLookupFails() {
    given(this.teamQueryService.getActiveTeamBySlug("nope"))
        .willThrow(new RuntimeException("team not found"));

    org.junit.jupiter.api.Assertions.assertThrows(
        RuntimeException.class,
        () -> this.scoreboardService.getScoreboardByTeamSlugAndGameId("nope", 1L));

    verify(this.gameQueryService, never()).getGameByTeamIdAndGameId("nope", 10L, 1L);
    verify(this.scoreboardMapper, never()).findScoreboardRowsByGameId(1L);
  }

  private void givenTeamAndGame() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.gameQueryService.getGameByTeamIdAndGameId("cats", 10L, 1L)).willReturn(this.gameRow);
  }

  private static ScoreboardRow createRow(
      Long scoreLineId,
      Long teamId,
      String teamName,
      boolean opponent,
      Integer displayOrder,
      Integer inningNumber,
      Integer inningRuns,
      String inningStatus,
      Integer runs,
      Integer hits,
      Integer errors) {
    var row = new ScoreboardRow();
    row.setScoreLineId(scoreLineId);
    row.setTeamId(teamId);
    row.setTeamName(teamName);
    row.setOpponent(opponent);
    row.setDisplayOrder(displayOrder);
    row.setInningNumber(inningNumber);
    row.setInningRuns(inningRuns);
    row.setInningStatus(inningStatus);
    row.setRuns(runs);
    row.setHits(hits);
    row.setErrors(errors);
    return row;
  }
}
