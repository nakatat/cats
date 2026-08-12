package dev.baseballscore.cats.api.tournament.mapper.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TournamentRow {

  private Long id;
  private Long teamId;
  private String name;
  private String shortName;
  private Integer seasonYear;
  private String description;
  private Integer displayOrder;
}
