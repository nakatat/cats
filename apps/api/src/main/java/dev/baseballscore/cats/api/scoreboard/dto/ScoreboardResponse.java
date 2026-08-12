package dev.baseballscore.cats.api.scoreboard.dto;

import dev.baseballscore.cats.api.game.InningScoreStatus;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(name = "ScoreboardResponse", description = "試合のイニングスコア")
public record ScoreboardResponse(
    @Schema(
            description = "イニングスコア登録状態",
            allowableValues = {"unregistered", "draft", "complete"},
            example = "complete")
        InningScoreStatus status,
    @ArraySchema(schema = @Schema(implementation = ScoreboardRowResponse.class))
        List<ScoreboardRowResponse> rows) {}
