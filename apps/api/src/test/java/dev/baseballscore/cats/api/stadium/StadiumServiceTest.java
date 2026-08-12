package dev.baseballscore.cats.api.stadium;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import dev.baseballscore.cats.api.stadium.mapper.StadiumMapper;
import dev.baseballscore.cats.api.stadium.mapper.model.StadiumRow;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class StadiumServiceTest {

  @Mock private StadiumMapper stadiumMapper;

  @InjectMocks private StadiumService stadiumService;

  @Test
  @DisplayName("getStadiums returns stadium list")
  void getStadiums_returnsStadiumList() {
    var firstRow =
        createStadiumRow(1L, "新琴似グリーン公園", "北海道札幌市北区新琴似1条12丁目", "札幌市", "北海道", "札幌市内の公園グラウンドです。");
    var secondRow =
        createStadiumRow(2L, "つどーむ野球場", "北海道札幌市東区栄町885番地1", "札幌市", "北海道", "屋外練習や試合で利用することがある球場です。");
    given(this.stadiumMapper.findStadiums()).willReturn(List.of(firstRow, secondRow));

    var responses = this.stadiumService.getStadiums();

    verify(this.stadiumMapper).findStadiums();
    assertEquals(2, responses.size());
    assertEquals(1L, responses.get(0).stadiumId());
    assertEquals("新琴似グリーン公園", responses.get(0).name());
    assertEquals("札幌市", responses.get(0).city());
    assertEquals("北海道", responses.get(0).prefecture());
    assertEquals(2L, responses.get(1).stadiumId());
  }

  @Test
  @DisplayName("getStadiumById returns stadium detail")
  void getStadiumById_returnsStadiumDetail() {
    var stadiumRow =
        createStadiumRow(1L, "新琴似グリーン公園", "北海道札幌市北区新琴似1条12丁目", "札幌市", "北海道", "札幌市内の公園グラウンドです。");
    given(this.stadiumMapper.findStadiumById(1L)).willReturn(stadiumRow);

    var response = this.stadiumService.getStadiumById(1L);

    verify(this.stadiumMapper).findStadiumById(1L);
    assertEquals(1L, response.stadiumId());
    assertEquals("新琴似グリーン公園", response.name());
    assertEquals("北海道札幌市北区新琴似1条12丁目", response.address());
    assertEquals("札幌市", response.city());
    assertEquals("北海道", response.prefecture());
    assertEquals("札幌市内の公園グラウンドです。", response.description());
  }

  @Test
  @DisplayName("getStadiumById throws StadiumNotFoundException when stadium missing")
  void getStadiumById_throwsStadiumNotFoundException() {
    given(this.stadiumMapper.findStadiumById(9999L)).willReturn(null);

    var exception =
        assertThrows(
            StadiumNotFoundException.class, () -> this.stadiumService.getStadiumById(9999L));

    verify(this.stadiumMapper).findStadiumById(9999L);
    assertEquals("STADIUM_NOT_FOUND", exception.getCode());
    assertEquals("球場が見つかりません。", exception.getResponseMessage());
    assertEquals("Stadium not found: 9999", exception.getMessage());
  }

  private static StadiumRow createStadiumRow(
      Long id, String name, String address, String city, String prefecture, String description) {
    var stadiumRow = new StadiumRow();
    stadiumRow.setId(id);
    stadiumRow.setName(name);
    stadiumRow.setAddress(address);
    stadiumRow.setCity(city);
    stadiumRow.setPrefecture(prefecture);
    stadiumRow.setDescription(description);
    return stadiumRow;
  }
}
