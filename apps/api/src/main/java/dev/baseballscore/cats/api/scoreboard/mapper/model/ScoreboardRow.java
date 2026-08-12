package dev.baseballscore.cats.api.scoreboard.mapper.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ScoreboardRow {

  private Long scoreLineId;
  private Long teamId;
  private String teamName;
  private boolean opponent;
  private Integer displayOrder;
  private Integer inningNumber;
  private Integer inningRuns;
  private String inningStatus;
  private Integer runs;
  private Integer hits;
  private Integer errors;
}
