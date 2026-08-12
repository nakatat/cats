package dev.baseballscore.cats.api.player;

import dev.baseballscore.cats.api.common.exception.NotFoundException;

public class PlayerNotFoundException extends NotFoundException {

  public PlayerNotFoundException(Long playerId) {
    super("PLAYER_NOT_FOUND", "選手が見つかりません。", "Player not found: " + playerId);
  }

  public PlayerNotFoundException(String teamSlug, Long playerId) {
    super(
        "PLAYER_NOT_FOUND",
        "選手が見つかりません。",
        "Player not found: teamSlug=" + teamSlug + ", playerId=" + playerId);
  }
}
