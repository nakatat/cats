package dev.baseballscore.cats.api.scoreboard.dto;

import dev.baseballscore.cats.api.scoreboard.InningStatus;
import dev.baseballscore.cats.api.scoreboard.mapper.model.ScoreboardRow;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Comparator;
import java.util.List;

@Schema(name = "ScoreboardRowResponse", description = "チーム別のイニングスコア")
public record ScoreboardRowResponse(
    @Schema(description = "スコア行ID", example = "1") Long scoreLineId,
    @Schema(description = "チームID。対戦相手の場合は null") Long teamId,
    @Schema(description = "チーム名") String teamName,
    @Schema(description = "対戦相手行かどうか", example = "false") boolean opponent,
    @ArraySchema(schema = @Schema(implementation = ScoreboardInningResponse.class))
        List<ScoreboardInningResponse> innings,
    @Schema(description = "合計得点", example = "5") Integer runs,
    @Schema(description = "安打数", example = "8") Integer hits,
    @Schema(description = "失策数", example = "1") Integer errors) {

  public static ScoreboardRowResponse from(List<ScoreboardRow> rows) {
    var firstRow = rows.get(0);
    var innings =
        rows.stream()
            .filter(row -> row.getInningNumber() != null)
            .sorted(Comparator.comparing((ScoreboardRow row) -> row.getInningNumber()))
            .map(
                row ->
                    new ScoreboardInningResponse(
                        row.getInningNumber(),
                        row.getInningRuns(),
                        InningStatus.fromValue(row.getInningStatus())))
            .toList();

    return new ScoreboardRowResponse(
        firstRow.getScoreLineId(),
        firstRow.getTeamId(),
        firstRow.getTeamName(),
        firstRow.isOpponent(),
        innings,
        firstRow.getRuns(),
        firstRow.getHits(),
        firstRow.getErrors());
  }
}
