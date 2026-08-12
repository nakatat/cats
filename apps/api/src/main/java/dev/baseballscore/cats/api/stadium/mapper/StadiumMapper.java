package dev.baseballscore.cats.api.stadium.mapper;

import dev.baseballscore.cats.api.stadium.mapper.model.StadiumRow;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface StadiumMapper {

  List<StadiumRow> findStadiums();

  StadiumRow findStadiumById(@Param("stadiumId") Long stadiumId);
}
