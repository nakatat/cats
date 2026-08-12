package dev.baseballscore.cats.api.team.mapper.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TeamRow {

  private Long id;
  private String slug;
  private String name;
  private String shortName;
  private String area;
  private Integer foundedYear;
  private String description;
  private String logoUrl;
  private String mainImageUrl;
  private boolean active;
}
