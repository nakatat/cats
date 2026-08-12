package dev.baseballscore.cats.api.team;

import dev.baseballscore.cats.api.common.exception.NotFoundException;

public class TeamNotFoundException extends NotFoundException {

  public TeamNotFoundException(String teamSlug) {
    super("TEAM_NOT_FOUND", "チームが見つかりません。", "Team not found: " + teamSlug);
  }
}
