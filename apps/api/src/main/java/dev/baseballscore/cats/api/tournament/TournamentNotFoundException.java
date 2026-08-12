package dev.baseballscore.cats.api.tournament;

import dev.baseballscore.cats.api.common.exception.NotFoundException;

public class TournamentNotFoundException extends NotFoundException {

  public TournamentNotFoundException(Long tournamentId) {
    super("TOURNAMENT_NOT_FOUND", "大会が見つかりません。", "Tournament not found: " + tournamentId);
  }

  public TournamentNotFoundException(String teamSlug, Long tournamentId) {
    super(
        "TOURNAMENT_NOT_FOUND",
        "大会が見つかりません。",
        "Tournament not found: teamSlug=" + teamSlug + ", tournamentId=" + tournamentId);
  }
}
