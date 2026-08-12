package dev.baseballscore.cats.api.player;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import dev.baseballscore.cats.api.player.mapper.PlayerMapper;
import dev.baseballscore.cats.api.player.mapper.model.PlayerRow;
import dev.baseballscore.cats.api.team.TeamQueryService;
import dev.baseballscore.cats.api.team.mapper.model.TeamRow;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PlayerServiceTest {

  @Mock private TeamQueryService teamQueryService;

  @Mock private PlayerMapper playerMapper;

  @InjectMocks private PlayerService playerService;

  private TeamRow teamRow;

  @BeforeEach
  void setUp() {
    this.teamRow = createTeamRow();
  }

  @Test
  @DisplayName("getPlayersByTeamSlug returns all players when active is null")
  void getPlayersByTeamSlug_returnsAllPlayersWhenActiveIsNull() {
    var firstRow =
        createPlayerRow(
            1L,
            10L,
            "山田 太郎",
            "やまだ たろう",
            "7",
            "内野手",
            "右",
            "右",
            LocalDate.of(2020, 4, 1),
            null,
            "https://example.com/player-1.png",
            "チームの主力選手");
    var secondRow =
        createPlayerRow(
            2L,
            10L,
            "佐藤 花子",
            "さとう はなこ",
            "11",
            "投手",
            "右",
            "左",
            LocalDate.of(2021, 4, 1),
            LocalDate.of(2024, 3, 31),
            null,
            null);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.playerMapper.findPlayersByTeamId(10L, null))
        .willReturn(List.of(firstRow, secondRow));

    var responses = this.playerService.getPlayersByTeamSlug("cats", null);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.playerMapper).findPlayersByTeamId(10L, null);
    assertEquals(2, responses.size());

    var firstResponse = responses.get(0);
    assertEquals(1L, firstResponse.playerId());
    assertEquals("山田 太郎", firstResponse.name());
    assertEquals("やまだ たろう", firstResponse.kana());
    assertEquals("7", firstResponse.uniformNumber());
    assertEquals("内野手", firstResponse.primaryPosition());
    assertEquals("右", firstResponse.throwingHand());
    assertEquals("右", firstResponse.battingHand());
    assertEquals(LocalDate.of(2020, 4, 1), firstResponse.joinedAt());
    assertEquals(null, firstResponse.leftAt());
    assertEquals("https://example.com/player-1.png", firstResponse.profileImageUrl());
    assertEquals("チームの主力選手", firstResponse.description());

    var secondResponse = responses.get(1);
    assertEquals(2L, secondResponse.playerId());
    assertEquals("佐藤 花子", secondResponse.name());
    assertEquals("さとう はなこ", secondResponse.kana());
    assertEquals("11", secondResponse.uniformNumber());
    assertEquals("投手", secondResponse.primaryPosition());
    assertEquals("右", secondResponse.throwingHand());
    assertEquals("左", secondResponse.battingHand());
    assertEquals(LocalDate.of(2021, 4, 1), secondResponse.joinedAt());
    assertEquals(LocalDate.of(2024, 3, 31), secondResponse.leftAt());
    assertEquals(null, secondResponse.profileImageUrl());
    assertEquals(null, secondResponse.description());
  }

  @Test
  @DisplayName("getPlayersByTeamSlug passes active=true to mapper")
  void getPlayersByTeamSlug_passesActiveTrue() {
    var activeRow =
        createPlayerRow(
            1L,
            10L,
            "山田 太郎",
            "やまだ たろう",
            "7",
            "内野手",
            "右",
            "右",
            LocalDate.of(2020, 4, 1),
            null,
            null,
            null);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.playerMapper.findPlayersByTeamId(10L, true)).willReturn(List.of(activeRow));

    var responses = this.playerService.getPlayersByTeamSlug("cats", true);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.playerMapper).findPlayersByTeamId(10L, true);
    assertEquals(1, responses.size());
    assertEquals(1L, responses.get(0).playerId());
    assertEquals(null, responses.get(0).leftAt());
  }

  @Test
  @DisplayName("getPlayersByTeamSlug passes active=false to mapper")
  void getPlayersByTeamSlug_passesActiveFalse() {
    var inactiveRow =
        createPlayerRow(
            2L,
            10L,
            "佐藤 花子",
            "さとう はなこ",
            "11",
            "投手",
            "右",
            "左",
            LocalDate.of(2021, 4, 1),
            LocalDate.of(2024, 3, 31),
            null,
            null);
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.playerMapper.findPlayersByTeamId(10L, false)).willReturn(List.of(inactiveRow));

    var responses = this.playerService.getPlayersByTeamSlug("cats", false);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.playerMapper).findPlayersByTeamId(10L, false);
    assertEquals(1, responses.size());
    assertEquals(2L, responses.get(0).playerId());
    assertEquals(LocalDate.of(2024, 3, 31), responses.get(0).leftAt());
  }

  @Test
  @DisplayName("getPlayerByTeamSlugAndPlayerId returns player detail")
  void getPlayerByTeamSlugAndPlayerId_returnsPlayerDetail() {
    var playerRow =
        createPlayerRow(
            1L,
            10L,
            "山田 太郎",
            "やまだ たろう",
            "7",
            "内野手",
            "右",
            "右",
            LocalDate.of(2020, 4, 1),
            null,
            "https://example.com/player-1.png",
            "チームの主力選手");
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.playerMapper.findPlayerByTeamIdAndPlayerId(10L, 1L)).willReturn(playerRow);

    var response = this.playerService.getPlayerByTeamSlugAndPlayerId("cats", 1L);

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.playerMapper).findPlayerByTeamIdAndPlayerId(10L, 1L);
    assertEquals(1L, response.playerId());
    assertEquals("山田 太郎", response.name());
    assertEquals("やまだ たろう", response.kana());
    assertEquals("7", response.uniformNumber());
    assertEquals("内野手", response.primaryPosition());
    assertEquals("右", response.throwingHand());
    assertEquals("右", response.battingHand());
    assertEquals(LocalDate.of(2020, 4, 1), response.joinedAt());
    assertEquals(null, response.leftAt());
    assertEquals("https://example.com/player-1.png", response.profileImageUrl());
    assertEquals("チームの主力選手", response.description());
  }

  @Test
  @DisplayName(
      "getPlayerByTeamSlugAndPlayerId throws PlayerNotFoundException when mapper returns null")
  void getPlayerByTeamSlugAndPlayerId_throwsPlayerNotFoundException() {
    given(this.teamQueryService.getActiveTeamBySlug("cats")).willReturn(this.teamRow);
    given(this.playerMapper.findPlayerByTeamIdAndPlayerId(10L, 9999L)).willReturn(null);

    var exception =
        assertThrows(
            PlayerNotFoundException.class,
            () -> this.playerService.getPlayerByTeamSlugAndPlayerId("cats", 9999L));

    verify(this.teamQueryService).getActiveTeamBySlug("cats");
    verify(this.playerMapper).findPlayerByTeamIdAndPlayerId(10L, 9999L);
    assertEquals("PLAYER_NOT_FOUND", exception.getCode());
    assertEquals("選手が見つかりません。", exception.getResponseMessage());
    assertEquals("Player not found: 9999", exception.getMessage());
  }

  private static PlayerRow createPlayerRow(
      Long id,
      Long teamId,
      String name,
      String kana,
      String uniformNumber,
      String primaryPosition,
      String throwingHand,
      String battingHand,
      LocalDate joinedAt,
      LocalDate leftAt,
      String profileImageUrl,
      String description) {
    var playerRow = new PlayerRow();
    playerRow.setId(id);
    playerRow.setTeamId(teamId);
    playerRow.setName(name);
    playerRow.setKana(kana);
    playerRow.setUniformNumber(uniformNumber);
    playerRow.setPrimaryPosition(primaryPosition);
    playerRow.setThrowingHand(throwingHand);
    playerRow.setBattingHand(battingHand);
    playerRow.setJoinedAt(joinedAt);
    playerRow.setLeftAt(leftAt);
    playerRow.setProfileImageUrl(profileImageUrl);
    playerRow.setDescription(description);
    return playerRow;
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
