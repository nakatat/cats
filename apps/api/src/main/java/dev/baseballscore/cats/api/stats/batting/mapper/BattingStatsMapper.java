package dev.baseballscore.cats.api.stats.batting.mapper;

import dev.baseballscore.cats.api.stats.batting.mapper.model.BattingStatsRow;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BattingStatsMapper {

  List<BattingStatsRow> aggregateBattingStatsByTeamId(
      @Param("teamId") Long teamId,
      @Param("seasonYear") Integer seasonYear,
      @Param("tournamentId") Long tournamentId,
      @Param("status") String status,
      @Param("includeGuests") boolean includeGuests);
}
