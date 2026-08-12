package dev.baseballscore.cats.api.scoreboard.dto;

import dev.baseballscore.cats.api.scoreboard.InningStatus;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ScoreboardInningResponse", description = "1イニングのスコア")
public record ScoreboardInningResponse(
    @Schema(description = "イニング番号", example = "7") int inningNumber,
    @Schema(description = "得点。statusがnot_battedの場合はnull", example = "0", nullable = true)
        Integer runs,
    @Schema(
            description = "イニング状態",
            allowableValues = {"played", "not_batted"},
            example = "played")
        InningStatus status) {}
