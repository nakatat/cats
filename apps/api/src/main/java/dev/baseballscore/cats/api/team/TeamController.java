package dev.baseballscore.cats.api.team;

import dev.baseballscore.cats.api.team.dto.SeasonResponse;
import dev.baseballscore.cats.api.team.dto.TeamResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teams")
@Tag(name = "Teams", description = "チーム情報とシーズン一覧")
public class TeamController {

  private final TeamService teamService;

  public TeamController(TeamService teamService) {
    this.teamService = teamService;
  }

  @GetMapping("/{teamSlug}")
  @Operation(summary = "チーム基本情報取得", description = "トップページ、ヘッダー、フッター、チーム紹介で使うチーム基本情報を返します。")
  public TeamResponse getTeam(
      @Parameter(description = "チームスラッグ", example = "cats") @PathVariable String teamSlug) {
    return this.teamService.getTeamBySlug(teamSlug);
  }

  @GetMapping("/{teamSlug}/seasons")
  @Operation(summary = "シーズン一覧取得", description = "年度切替、試合一覧、成績ページで使うシーズン一覧を返します。")
  public List<SeasonResponse> getSeasons(
      @Parameter(description = "チームスラッグ", example = "cats") @PathVariable String teamSlug) {
    return this.teamService.getSeasonsByTeamSlug(teamSlug);
  }
}
