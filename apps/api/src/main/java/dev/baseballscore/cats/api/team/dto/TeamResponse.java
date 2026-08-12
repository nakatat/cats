package dev.baseballscore.cats.api.team.dto;

import dev.baseballscore.cats.api.team.mapper.model.TeamRow;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "TeamResponse", description = "チーム基本情報")
public record TeamResponse(
    @Schema(description = "チームID", example = "1") Long id,
    @Schema(description = "URL用スラッグ", example = "cats") String slug,
    @Schema(description = "チーム正式名称", example = "新琴似CATS") String name,
    @Schema(description = "短い表示名", example = "CATS") String shortName,
    @Schema(description = "活動エリア", example = "北海道札幌市") String area,
    @Schema(description = "結成年", example = "2005") Integer foundedYear,
    @Schema(description = "チーム紹介文", example = "札幌市を拠点に活動する草野球チームです。") String description,
    @Schema(description = "ロゴ画像URL") String logoUrl,
    @Schema(description = "メイン画像URL") String mainImageUrl,
    @Schema(description = "公開中かどうか", example = "true") boolean isActive) {
  public static TeamResponse from(TeamRow teamRow) {
    return new TeamResponse(
        teamRow.getId(),
        teamRow.getSlug(),
        teamRow.getName(),
        teamRow.getShortName(),
        teamRow.getArea(),
        teamRow.getFoundedYear(),
        teamRow.getDescription(),
        teamRow.getLogoUrl(),
        teamRow.getMainImageUrl(),
        teamRow.isActive());
  }
}
