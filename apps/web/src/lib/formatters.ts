/**
 * 日付文字列を日本語の年月日へ変換する。
 *
 * <p>表示結果はAsia/Tokyo timezoneで固定し、値がない場合は日付未定を返す。
 */
export function formatGameDate(date: string | null | undefined) {
  if (!date) {
    return '日付未定';
  }

  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
}

/**
 * 日付文字列を長い日本語表記へ変換する。timezoneはAsia/Tokyoに固定する。
 */
export function formatGameDateLong(value: string | null | undefined) {
  if (!value) {
    return '日付未定';
  }

  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Tokyo',
  }).format(new Date(value));
}

/**
 * 日付文字列を曜日付きの日本語表記へ変換する。timezoneはAsia/Tokyoに固定する。
 */
export function formatGameDateWithWeekday(value: string | null | undefined) {
  if (!value) {
    return '日付未定';
  }

  const date = new Date(value);

  const dateText = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Tokyo',
  }).format(date);

  const weekday = new Intl.DateTimeFormat('ja-JP', {
    weekday: 'short',
    timeZone: 'Asia/Tokyo',
  }).format(date);

  return `${dateText}（${weekday}）`;
}

export function formatGameResult(result: string | null | undefined) {
  if (!result) {
    return '未定';
  }

  const resultMap: Record<string, string> = {
    win: '勝ち',
    loss: '負け',
    draw: '引き分け',
    scheduled: '予定',
  };

  return resultMap[result] ?? result;
}

export function formatGameScore(
  runsFor: number | null | undefined,
  runsAgainst: number | null | undefined
) {
  if (runsFor == null || runsAgainst == null) {
    return '未定';
  }

  return `${runsFor} - ${runsAgainst}`;
}

export function formatRecordPercentage(value: string | null | undefined) {
  return value ?? '0.000';
}

/**
 * APIの率文字列を画面表示用に整える。
 *
 * 値がない場合は`.000`を返し、`0.`で始まる値だけ先頭の0を省略する。
 * この関数自体では丸めを行わない。
 */
export function formatRate(value: string | null | undefined) {
  if (!value) {
    return '.000';
  }

  return value.startsWith('0.') ? value.slice(1) : value;
}

export function formatGameTime(value: string | null | undefined) {
  if (!value) {
    return '未定';
  }

  const [hours, minutes] = value.split(':');

  if (hours == null || minutes == null) {
    return value;
  }

  return `${hours}:${minutes}`;
}

/**
 * 選手名の先頭の語だけをモバイル表示用の短縮名として返す。
 *
 * <p>前後の空白を除去し、連続する空白を区切りとして扱う。
 */
export function formatMobilePlayerName(displayName: string) {
  return displayName.trim().split(/\s+/u)[0] ?? displayName;
}
