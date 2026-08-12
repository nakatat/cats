package dev.baseballscore.cats.api.stadium.dto;

import dev.baseballscore.cats.api.stadium.mapper.model.StadiumRow;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "StadiumResponse", description = "球場情報")
public record StadiumResponse(
    @Schema(description = "球場ID", example = "1") Long stadiumId,
    @Schema(description = "球場名", example = "新琴似グリーン公園") String name,
    @Schema(description = "住所", example = "北海道札幌市北区新琴似1条12丁目") String address,
    @Schema(description = "市区町村", example = "札幌市") String city,
    @Schema(description = "都道府県", example = "北海道") String prefecture,
    @Schema(description = "説明", example = "主な活動場所です。") String description) {

  public static StadiumResponse from(StadiumRow stadiumRow) {
    return new StadiumResponse(
        stadiumRow.getId(),
        stadiumRow.getName(),
        stadiumRow.getAddress(),
        stadiumRow.getCity(),
        stadiumRow.getPrefecture(),
        stadiumRow.getDescription());
  }
}
