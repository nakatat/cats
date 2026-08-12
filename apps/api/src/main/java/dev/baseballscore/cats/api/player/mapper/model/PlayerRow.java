package dev.baseballscore.cats.api.player.mapper.model;

import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PlayerRow {

  private Long id;
  private Long teamId;
  private String name;
  private String kana;
  private String uniformNumber;
  private String primaryPosition;
  private String throwingHand;
  private String battingHand;
  private LocalDate joinedAt;
  private LocalDate leftAt;
  private String profileImageUrl;
  private String description;
}
