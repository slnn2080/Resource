/* eslint-disable prettier/prettier */
import { LanguageEnum } from '~/store/enum/language';

/**
 * アクター
 */
export enum Actor {
  /** 受験者 */
  TESTER = 1,
  /** 監視者 */
  CHECKER,
  /** 試験管理者 */
  TEST_MANAGER,
  /** システム管理者 */
  SYSTEM_MANAGER,
  /** 監督官 */
  SUPERVISOR,
}

export type ActorData = {
  id: Actor;
  name: string;
  isAccessLimitTarget: boolean;
};

export class ActorUtils {
  /**
   * アクターリストを生成します
   *
   * @return {Actor[]}
   */
  public static getList(): Actor[] {
    return [
      Actor.TESTER,
      Actor.CHECKER,
      Actor.TEST_MANAGER,
      Actor.SYSTEM_MANAGER,
      Actor.SUPERVISOR,
    ];
  }

  /**
   * アクター情報リストを生成します
   *
   * @param {LanguageEnum} displayLang
   * @return {ActorData[]}
   */
  public static makeActorDataList(displayLang: LanguageEnum): ActorData[] {
    return [
      {
        id: Actor.TESTER,
        name: displayLang.ACTOR_TESTER,
        isAccessLimitTarget: false,
      },
      {
        id: Actor.CHECKER,
        name: displayLang.ACTOR_CHECKER,
        isAccessLimitTarget: true,
      },
      {
        id: Actor.TEST_MANAGER,
        name: displayLang.ACTOR_TEST_MANAGER,
        isAccessLimitTarget: true,
      },
      {
        id: Actor.SYSTEM_MANAGER,
        name: displayLang.ACTOR_SYSTEM_MANAGER,
        isAccessLimitTarget: true,
      },
      {
        id: Actor.SUPERVISOR,
        name: displayLang.ACTOR_SUPERVISOR,
        isAccessLimitTarget: true,
      },
    ];
  }

  /**
   * アクターの文字列表現を取得します
   *
   * @param {Actor} actor
   * @param {LanguageEnum} displayLang
   * @return {ActorData | null}
   */
  public static getActorData(actor: Actor, displayLang: LanguageEnum): ActorData | null {
    const list = ActorUtils.makeActorDataList(displayLang);
    const found = list.find(v => v.id == actor);
    if (found == undefined) {
      return null;
    }
    return found;
  }

  /**
   * アクターの文字列表現を取得します
   *
   * @param {Actor} actor
   * @param {LanguageEnum} displayLang
   * @return {string}
   */
  public static toString(actor: Actor, displayLang: LanguageEnum): string {
    const found = ActorUtils.getActorData(actor, displayLang);
    if (! found) {
      return '';
    }
    return found.name;
  }
}

