package dev.baseballscore.cats.api.team.mapper;

import dev.baseballscore.cats.api.team.mapper.model.SeasonRow;
import dev.baseballscore.cats.api.team.mapper.model.TeamRow;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface TeamMapper {

  TeamRow findActiveTeamBySlug(@Param("slug") String slug);

  List<SeasonRow> findSeasonsByTeamId(@Param("teamId") Long teamId);
}
