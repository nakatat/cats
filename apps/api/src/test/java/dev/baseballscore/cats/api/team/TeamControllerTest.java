package dev.baseballscore.cats.api.team;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.baseballscore.cats.api.common.exception.ApiExceptionHandler;
import dev.baseballscore.cats.api.team.dto.SeasonResponse;
import dev.baseballscore.cats.api.team.dto.TeamResponse;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = TeamController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("webmvc-test")
@Import(ApiExceptionHandler.class)
class TeamControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private TeamService teamService;

  @Test
  @DisplayName("GET /api/teams/cats returns team basic info")
  void getTeam_returnsTeamBasicInfo() throws Exception {
    given(this.teamService.getTeamBySlug("cats"))
        .willReturn(
            new TeamResponse(
                1L,
                "cats",
                "新琴似CATS",
                "CATS",
                "北海道札幌市",
                2005,
                "札幌市を拠点に活動する草野球チームです。",
                null,
                null,
                true));

    this.mockMvc
        .perform(get("/api/teams/cats").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.slug").value("cats"))
        .andExpect(jsonPath("$.name").value("新琴似CATS"))
        .andExpect(jsonPath("$.shortName").value("CATS"))
        .andExpect(jsonPath("$.area").value("北海道札幌市"))
        .andExpect(jsonPath("$.isActive").value(true));
  }

  @Test
  @DisplayName("GET /api/teams/cats/seasons returns seasons")
  void getSeasons_returnsSeasons() throws Exception {
    given(this.teamService.getSeasonsByTeamSlug("cats"))
        .willReturn(
            List.of(
                new SeasonResponse(
                    1L,
                    2024,
                    "2024年度",
                    LocalDate.of(2024, 1, 1),
                    LocalDate.of(2024, 12, 31),
                    true)));

    this.mockMvc
        .perform(get("/api/teams/cats/seasons").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].year").value(2024))
        .andExpect(jsonPath("$[0].name").value("2024年度"))
        .andExpect(jsonPath("$[0].isCurrent").value(true));
  }

  @Test
  @DisplayName("GET /api/teams/nope returns team not found")
  void getTeam_returns404WhenTeamMissing() throws Exception {
    given(this.teamService.getTeamBySlug("nope")).willThrow(new TeamNotFoundException("nope"));

    this.mockMvc
        .perform(get("/api/teams/nope").servletPath("/api").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("TEAM_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("チームが見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());
  }
}
