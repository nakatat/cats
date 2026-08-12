package dev.baseballscore.cats.api.team.mapper.model;

import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SeasonRow {

  private Long id;
  private Integer year;
  private String name;
  private LocalDate startDate;
  private LocalDate endDate;
  private boolean current;
}
