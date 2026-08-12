package dev.baseballscore.cats.api.game.mapper;

import dev.baseballscore.cats.api.game.mapper.model.GameRow;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface GameMapper {

  List<GameRow> findGamesByTeamId(
      @Param("teamId") Long teamId,
      @Param("seasonYear") Integer seasonYear,
      @Param("status") String status);

  GameRow findGameByTeamIdAndGameId(@Param("teamId") Long teamId, @Param("gameId") Long gameId);
}
