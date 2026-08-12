package dev.baseballscore.cats.api.stats.pitching.mapper.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PitchingStatsRow {

  private Long playerId;
  private String displayName;
  private String profileImageUrl;
  private String uniformNumber;
  private boolean guest;
  private Integer games;
  private Integer outsPitched;
  private Integer battersFaced;
  private Integer pitches;
  private Integer hitsAllowed;
  private Integer homeRunsAllowed;
  private Integer runsAllowed;
  private Integer earnedRuns;
  private Integer walks;
  private Integer hitByPitch;
  private Integer strikeouts;
  private Integer wins;
  private Integer losses;
  private Integer saves;
  private Integer holds;
}
