package dev.baseballscore.cats.api.stadium;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.baseballscore.cats.api.common.exception.ApiExceptionHandler;
import dev.baseballscore.cats.api.stadium.dto.StadiumResponse;
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

@WebMvcTest(controllers = StadiumController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("webmvc-test")
@Import(ApiExceptionHandler.class)
class StadiumControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private StadiumService stadiumService;

  @Test
  @DisplayName("GET /api/stadiums returns stadiums")
  void getStadiums_returnsStadiums() throws Exception {
    given(this.stadiumService.getStadiums())
        .willReturn(
            List.of(
                new StadiumResponse(
                    1L, "新琴似グリーン公園", "北海道札幌市北区新琴似1条12丁目", "札幌市", "北海道", "札幌市内の公園グラウンドです。")));

    this.mockMvc
        .perform(get("/api/stadiums").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].stadiumId").value(1L))
        .andExpect(jsonPath("$[0].name").value("新琴似グリーン公園"))
        .andExpect(jsonPath("$[0].city").value("札幌市"))
        .andExpect(jsonPath("$[0].prefecture").value("北海道"));

    verify(this.stadiumService).getStadiums();
  }

  @Test
  @DisplayName("GET /api/stadiums/{stadiumId} returns stadium detail")
  void getStadium_returnsStadiumDetail() throws Exception {
    given(this.stadiumService.getStadiumById(1L))
        .willReturn(
            new StadiumResponse(
                1L, "新琴似グリーン公園", "北海道札幌市北区新琴似1条12丁目", "札幌市", "北海道", "札幌市内の公園グラウンドです。"));

    this.mockMvc
        .perform(get("/api/stadiums/1").servletPath("/api"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.stadiumId").value(1L))
        .andExpect(jsonPath("$.name").value("新琴似グリーン公園"))
        .andExpect(jsonPath("$.address").value("北海道札幌市北区新琴似1条12丁目"))
        .andExpect(jsonPath("$.city").value("札幌市"))
        .andExpect(jsonPath("$.prefecture").value("北海道"))
        .andExpect(jsonPath("$.description").value("札幌市内の公園グラウンドです。"));

    verify(this.stadiumService).getStadiumById(1L);
  }

  @Test
  @DisplayName("GET /api/stadiums/9999 returns stadium not found")
  void getStadium_returns404WhenStadiumMissing() throws Exception {
    given(this.stadiumService.getStadiumById(9999L)).willThrow(new StadiumNotFoundException(9999L));

    this.mockMvc
        .perform(get("/api/stadiums/9999").servletPath("/api").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error.code").value("STADIUM_NOT_FOUND"))
        .andExpect(jsonPath("$.error.message").value("球場が見つかりません。"))
        .andExpect(jsonPath("$.error.details").isEmpty());

    verify(this.stadiumService).getStadiumById(9999L);
  }
}
