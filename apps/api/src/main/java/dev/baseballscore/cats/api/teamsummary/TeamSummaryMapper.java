package dev.baseballscore.cats.api.teamsummary;

import dev.baseballscore.cats.api.team.mapper.model.SeasonRow;
import dev.baseballscore.cats.api.teamsummary.mapper.model.SummaryGameRow;
import dev.baseballscore.cats.api.teamsummary.mapper.model.SummaryRecordRow;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface TeamSummaryMapper {

  SeasonRow findCurrentSeasonByTeamId(@Param("teamId") Long teamId);

  SeasonRow findSeasonByTeamIdAndYear(
      @Param("teamId") Long teamId, @Param("seasonYear") Integer seasonYear);

  SeasonRow findLatestSeasonByTeamId(@Param("teamId") Long teamId);

  SummaryRecordRow findSummaryRecordBySeasonId(@Param("seasonId") Long seasonId);

  SummaryRecordRow findSummaryRecordByTeamId(@Param("teamId") Long teamId);

  List<SummaryGameRow> findRecentGamesBySeasonId(
      @Param("seasonId") Long seasonId, @Param("limit") Integer limit);

  List<SummaryGameRow> findUpcomingGamesBySeasonId(
      @Param("seasonId") Long seasonId, @Param("limit") Integer limit);
}
