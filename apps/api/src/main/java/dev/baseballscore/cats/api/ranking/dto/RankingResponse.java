package dev.baseballscore.cats.api.ranking.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(name = "RankingResponse", description = "ランキング一覧")
public record RankingResponse(
    @Schema(description = "打撃ランキング") List<RankingGroupResponse> batting,
    @Schema(description = "投手ランキング") List<RankingGroupResponse> pitching,
    @Schema(description = "規定打席数", example = "27") Integer requiredPlateAppearances,
    @Schema(description = "規定投球回のアウト数", example = "27") Integer requiredInningsPitchedOuts,
    @Schema(description = "規定投球回表示", example = "9回") String requiredInningsPitchedText) {

  public RankingResponse(List<RankingGroupResponse> batting, List<RankingGroupResponse> pitching) {
    this(batting, pitching, null, null, null);
  }
}
