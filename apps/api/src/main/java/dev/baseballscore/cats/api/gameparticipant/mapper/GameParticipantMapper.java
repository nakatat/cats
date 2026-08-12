package dev.baseballscore.cats.api.gameparticipant.mapper;

import dev.baseballscore.cats.api.gameparticipant.mapper.model.GameParticipantRow;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface GameParticipantMapper {

  List<GameParticipantRow> findParticipantsByGameIdAndTeamId(
      @Param("teamId") Long teamId, @Param("gameId") Long gameId);
}
