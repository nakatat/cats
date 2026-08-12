package dev.baseballscore.cats.api.pitchingline.mapper.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PitchingLineRow {

  private Long pitchingLineId;
  private Long gameParticipantId;
  private Long gameId;
  private Long teamId;
  private Long playerId;
  private String displayName;
  private String uniformNumber;
  private Integer pitchingOrder;
  private boolean guest;
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
