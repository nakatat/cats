package dev.baseballscore.cats.api.teamsummary.mapper.model;

import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SummaryGameRow {

  private Long gameId;
  private LocalDate gameDate;
  private LocalTime startTime;
  private String opponentName;
  private String status;
  private String result;
  private Integer runsFor;
  private Integer runsAgainst;
  private Long tournamentId;
  private String tournamentName;
  private Long stadiumId;
  private String stadiumName;
  private String venueName;
}
