package dev.baseballscore.cats.api.team;

import dev.baseballscore.cats.api.common.exception.NotFoundException;

public class SeasonNotFoundException extends NotFoundException {

  public SeasonNotFoundException(String teamSlug, Integer seasonYear) {
    super(
        "SEASON_NOT_FOUND",
        "年度が見つかりません。",
        "Season not found: teamSlug="
            + teamSlug
            + ", seasonYear="
            + (seasonYear == null ? "current" : seasonYear));
  }
}
