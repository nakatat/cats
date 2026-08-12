package dev.baseballscore.cats.api.player.mapper;

import dev.baseballscore.cats.api.player.mapper.model.PlayerRow;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PlayerMapper {

  List<PlayerRow> findPlayersByTeamId(
      @Param("teamId") Long teamId, @Param("active") Boolean active);

  PlayerRow findPlayerByTeamIdAndPlayerId(
      @Param("teamId") Long teamId, @Param("playerId") Long playerId);
}
