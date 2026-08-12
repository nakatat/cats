package dev.baseballscore.cats.api.stadium;

import dev.baseballscore.cats.api.stadium.dto.StadiumResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/stadiums")
@Tag(name = "Stadiums", description = "球場情報")
public class StadiumController {

  private final StadiumService stadiumService;

  public StadiumController(StadiumService stadiumService) {
    this.stadiumService = stadiumService;
  }

  @GetMapping
  @Operation(summary = "球場一覧取得", description = "公開球場一覧を返します。")
  public List<StadiumResponse> getStadiums() {
    return this.stadiumService.getStadiums();
  }

  @GetMapping("/{stadiumId}")
  @Operation(summary = "球場詳細取得", description = "指定した球場IDの詳細を返します。")
  public StadiumResponse getStadium(
      @Parameter(description = "球場ID", example = "1") @PathVariable Long stadiumId) {
    return this.stadiumService.getStadiumById(stadiumId);
  }
}
