package dev.baseballscore.cats.api.scoreboard.mapper;

import dev.baseballscore.cats.api.scoreboard.mapper.model.ScoreboardRow;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ScoreboardMapper {

  List<ScoreboardRow> findScoreboardRowsByGameId(@Param("gameId") Long gameId);
}
