package dev.baseballscore.cats.api.battingline.mapper.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BattingLineRow {

  private Long battingLineId;
  private Long gameParticipantId;
  private Long gameId;
  private Long teamId;
  private Long playerId;
  private String displayName;
  private String uniformNumber;
  private Integer battingOrder;
  private String position;
  private boolean guest;
  private Integer plateAppearances;
  private Integer atBats;
  private Integer hits;
  private Integer doubles;
  private Integer triples;
  private Integer homeRuns;
  private Integer runsBattedIn;
  private Integer runs;
  private Integer walks;
  private Integer hitByPitch;
  private Integer strikeouts;
  private Integer stolenBases;
  private Integer sacrificeHits;
  private Integer sacrificeFlies;
  private Integer caughtStealing;
  private Integer reachedOnErrors;
}
