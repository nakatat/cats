package dev.baseballscore.cats.api.ranking.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface RankingMapper {

  int countGamesForPlateAppearanceQualification(
      @Param("teamSlug") String teamSlug,
      @Param("seasonYear") Integer seasonYear,
      @Param("tournamentId") Long tournamentId,
      @Param("status") String status);
}
