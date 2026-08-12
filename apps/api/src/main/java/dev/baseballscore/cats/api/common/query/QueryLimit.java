package dev.baseballscore.cats.api.common.query;

import dev.baseballscore.cats.api.common.exception.BadRequestException;

/**
 * 一覧・サマリー系queryのlimitを共通の範囲へ正規化する。
 *
 * <p>nullは5として扱い、1以上20以下だけを有効値とする。範囲外の値は、 resourceNameをエラー内容に利用した{@link BadRequestException}に変換する。
 */
public final class QueryLimit {

  private static final int DEFAULT_LIMIT = 5;
  private static final int MAX_LIMIT = 20;

  private QueryLimit() {}

  /**
   * limitを既定値または許容範囲へ正規化する。
   *
   * @param limit queryで指定されたlimit。nullの場合は5
   * @param resourceName エラー内容に含めるリソース名
   * @return 1以上20以下のlimit
   * @throws BadRequestException limitが1未満または20超の場合
   */
  public static int normalize(Integer limit, String resourceName) {
    var effectiveLimit = limit == null ? DEFAULT_LIMIT : limit;
    if (effectiveLimit < 1 || effectiveLimit > MAX_LIMIT) {
      throw new BadRequestException("Invalid " + resourceName + " limit: " + effectiveLimit);
    }
    return effectiveLimit;
  }
}
