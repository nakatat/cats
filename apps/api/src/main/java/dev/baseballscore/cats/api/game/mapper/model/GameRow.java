package dev.baseballscore.cats.api.game.mapper.model;

import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GameRow {

  private Long id;
  private Long teamId;
  private Long seasonId;
  private Integer seasonYear;
  private Long tournamentId;
  private String tournamentName;
  private Long stadiumId;
  private String stadiumName;
  private LocalDate gameDate;
  private LocalTime startTime;
  private String opponentName;
  private String homeAway;
  private String gameType;
  private String status;
  private String inningScoreStatus;
  private Integer runsFor;
  private Integer runsAgainst;
  private String result;
  private String venueName;
  private String note;
}
