package dev.baseballscore.cats.api.tournament.mapper;

import dev.baseballscore.cats.api.tournament.mapper.model.TournamentRow;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface TournamentMapper {

  List<TournamentRow> findTournamentsByTeamId(@Param("teamId") Long teamId);

  TournamentRow findTournamentByTeamIdAndTournamentId(
      @Param("teamId") Long teamId, @Param("tournamentId") Long tournamentId);
}
