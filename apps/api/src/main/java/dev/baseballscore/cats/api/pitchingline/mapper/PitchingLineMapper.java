package dev.baseballscore.cats.api.pitchingline.mapper;

import dev.baseballscore.cats.api.pitchingline.mapper.model.PitchingLineRow;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PitchingLineMapper {

  List<PitchingLineRow> findPitchingLinesByGameIdAndTeamId(
      @Param("teamId") Long teamId, @Param("gameId") Long gameId);
}
