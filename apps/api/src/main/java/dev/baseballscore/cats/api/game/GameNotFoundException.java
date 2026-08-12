package dev.baseballscore.cats.api.game;

import dev.baseballscore.cats.api.common.exception.NotFoundException;

public class GameNotFoundException extends NotFoundException {

  public GameNotFoundException(Long gameId) {
    super("GAME_NOT_FOUND", "試合が見つかりません。", "Game not found: " + gameId);
  }

  public GameNotFoundException(String teamSlug, Long gameId) {
    super(
        "GAME_NOT_FOUND",
        "試合が見つかりません。",
        "Game not found: teamSlug=" + teamSlug + ", gameId=" + gameId);
  }
}
