package dev.baseballscore.cats.api.teamsummary.mapper.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SummaryRecordRow {

  private Integer games;
  private Integer wins;
  private Integer losses;
  private Integer draws;
  private Integer runsFor;
  private Integer runsAgainst;
}
