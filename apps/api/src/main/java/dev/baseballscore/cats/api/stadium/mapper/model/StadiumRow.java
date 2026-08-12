package dev.baseballscore.cats.api.stadium.mapper.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StadiumRow {

  private Long id;
  private String name;
  private String address;
  private String city;
  private String prefecture;
  private String description;
}
