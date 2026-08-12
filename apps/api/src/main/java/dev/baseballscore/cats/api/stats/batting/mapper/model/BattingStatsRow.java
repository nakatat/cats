package dev.baseballscore.cats.api.stats.batting.mapper.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BattingStatsRow {

  private Long playerId;
  private String displayName;
  private String profileImageUrl;
  private String uniformNumber;
  private boolean guest;
  private Integer games;
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
  private Integer sacrificeHits;
  private Integer sacrificeFlies;
  private Integer stolenBases;
  private Integer caughtStealing;
  private Integer reachedOnErrors;
}
