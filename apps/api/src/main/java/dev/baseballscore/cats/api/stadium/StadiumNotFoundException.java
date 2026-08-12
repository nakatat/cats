package dev.baseballscore.cats.api.stadium;

import dev.baseballscore.cats.api.common.exception.NotFoundException;

public class StadiumNotFoundException extends NotFoundException {

  public StadiumNotFoundException(Long stadiumId) {
    super("STADIUM_NOT_FOUND", "球場が見つかりません。", "Stadium not found: " + stadiumId);
  }
}
