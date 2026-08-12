package dev.baseballscore.cats.api.tournament;

import dev.baseballscore.cats.api.tournament.dto.TournamentResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teams/{teamSlug}/tournaments")
@Tag(name = "Tournaments", description = "大会・リーグ・イベント情報")
public class TournamentController {

  private final TournamentService tournamentService;

  public TournamentController(TournamentService tournamentService) {
    this.tournamentService = tournamentService;
  }

  @GetMapping
  @Operation(summary = "大会一覧取得", description = "チームに紐づく大会・リーグ・イベント分類の一覧を返します。")
  public List<TournamentResponse> getTournaments(
      @Parameter(description = "チームスラッグ", example = "cats") @PathVariable String teamSlug) {
    return this.tournamentService.getTournamentsByTeamSlug(teamSlug);
  }

  @GetMapping("/{tournamentId}")
  @Operation(summary = "大会詳細取得", description = "指定した大会IDの詳細を返します。")
  public TournamentResponse getTournament(
      @Parameter(description = "チームスラッグ", example = "cats") @PathVariable String teamSlug,
      @Parameter(description = "大会ID", example = "1") @PathVariable Long tournamentId) {
    return this.tournamentService.getTournamentByTeamSlugAndTournamentId(teamSlug, tournamentId);
  }
}
