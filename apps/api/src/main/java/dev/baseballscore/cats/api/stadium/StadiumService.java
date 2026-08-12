package dev.baseballscore.cats.api.stadium;

import dev.baseballscore.cats.api.stadium.dto.StadiumResponse;
import dev.baseballscore.cats.api.stadium.mapper.StadiumMapper;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StadiumService {

  private final StadiumMapper stadiumMapper;

  public StadiumService(StadiumMapper stadiumMapper) {
    this.stadiumMapper = stadiumMapper;
  }

  @Transactional(readOnly = true)
  public List<StadiumResponse> getStadiums() {
    return this.stadiumMapper.findStadiums().stream().map(StadiumResponse::from).toList();
  }

  @Transactional(readOnly = true)
  public StadiumResponse getStadiumById(Long stadiumId) {
    var stadiumRow = this.stadiumMapper.findStadiumById(stadiumId);
    if (stadiumRow == null) {
      throw new StadiumNotFoundException(stadiumId);
    }
    return StadiumResponse.from(stadiumRow);
  }
}
