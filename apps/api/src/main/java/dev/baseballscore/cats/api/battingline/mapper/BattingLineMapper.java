package dev.baseballscore.cats.api.battingline.mapper;

import dev.baseballscore.cats.api.battingline.mapper.model.BattingLineRow;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BattingLineMapper {

  List<BattingLineRow> findBattingLinesByGameIdAndTeamId(
      @Param("teamId") Long teamId, @Param("gameId") Long gameId);
}
