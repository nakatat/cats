package dev.baseballscore.cats.api.team;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;

import dev.baseballscore.cats.api.team.mapper.TeamMapper;
import dev.baseballscore.cats.api.team.mapper.model.TeamRow;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TeamQueryServiceTest {

  @Mock private TeamMapper teamMapper;

  @InjectMocks private TeamQueryService teamQueryService;

  @Test
  @DisplayName("getActiveTeamBySlug returns active team")
  void getActiveTeamBySlug_returnsActiveTeam() {
    var teamRow = createTeamRow();
    given(this.teamMapper.findActiveTeamBySlug("cats")).willReturn(teamRow);

    var result = this.teamQueryService.getActiveTeamBySlug("cats");

    assertEquals(10L, result.getId());
    assertEquals("cats", result.getSlug());
    assertEquals("新琴似CATS", result.getName());
  }

  @Test
  @DisplayName("getActiveTeamBySlug throws TeamNotFoundException when team missing")
  void getActiveTeamBySlug_throwsTeamNotFoundException() {
    given(this.teamMapper.findActiveTeamBySlug("nope")).willReturn(null);

    var exception =
        assertThrows(
            TeamNotFoundException.class, () -> this.teamQueryService.getActiveTeamBySlug("nope"));

    assertEquals("TEAM_NOT_FOUND", exception.getCode());
    assertEquals("チームが見つかりません。", exception.getResponseMessage());
    assertEquals("Team not found: nope", exception.getMessage());
  }

  private static TeamRow createTeamRow() {
    var teamRow = new TeamRow();
    teamRow.setId(10L);
    teamRow.setSlug("cats");
    teamRow.setName("新琴似CATS");
    teamRow.setShortName("CATS");
    teamRow.setArea("北海道札幌市");
    teamRow.setFoundedYear(2005);
    teamRow.setDescription("札幌市を拠点に活動する草野球チームです。");
    teamRow.setLogoUrl(null);
    teamRow.setMainImageUrl(null);
    teamRow.setActive(true);
    return teamRow;
  }
}
