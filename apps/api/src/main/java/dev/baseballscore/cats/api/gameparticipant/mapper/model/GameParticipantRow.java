package dev.baseballscore.cats.api.gameparticipant.mapper.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GameParticipantRow {

  private Long gameParticipantId;
  private Long gameId;
  private Long playerId;
  private String displayName;
  private String uniformNumber;
  private Integer battingOrder;
  private String position;
  private boolean starter;
  private boolean guest;
}
