package dev.baseballscore.cats.api.stats.pitching.mapper;

import dev.baseballscore.cats.api.stats.pitching.mapper.model.PitchingStatsRow;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PitchingStatsMapper {

  List<PitchingStatsRow> aggregatePitchingStatsByTeamId(
      @Param("teamId") Long teamId,
      @Param("seasonYear") Integer seasonYear,
      @Param("tournamentId") Long tournamentId,
      @Param("status") String status,
      @Param("includeGuests") boolean includeGuests);
}
