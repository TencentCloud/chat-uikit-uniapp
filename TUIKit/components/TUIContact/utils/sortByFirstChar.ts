import { getChinesePinyinFirstLetter } from './getChinesePinyinFirstLetter';

/**
 * 通用关系链排序工具类
 * 实现微信风格的排序规则：字母 > 汉字按拼音首字母 > 数字 > 特殊字符
 * 数字和特殊字符归到 # 组中
 * 支持多种数据类型的排序
 */

// 获取字符串的首字母或首字符，用于排序
function getFirstChar(str: string): string {
  if (!str) return '';

  const firstChar = str.charAt(0);

  // 数字
  if (/\d/.test(firstChar)) {
    return '0'; // 数字统一用 '0' 表示
  }

  // 英文字母
  if (/[a-zA-Z]/.test(firstChar)) {
    return firstChar.toUpperCase();
  }

  // 中文字符
  if (/[\u4e00-\u9fa5]/.test(firstChar)) {
    return getChinesePinyinFirstLetter(firstChar);
  }

  // 其他特殊字符
  return 'ZZ'; // 特殊字符标识
}

// 排序优先级：字母 > 汉字按拼音首字母 > 数字 > 特殊字符
function getSortPriority(char: string): number {
  if (/[A-Z]/.test(char)) return 1; // 字母（包括汉字的拼音首字母）
  if (char === '0') return 2; // 数字
  return 3; // 其他特殊字符
}

// 获取分组键，用于显示
function getGroupKey(firstChar: string): string {
  if (/[A-Z]/.test(firstChar)) return firstChar; // 字母组（包括汉字按拼音首字母分组）
  return '#'; // 数字和特殊字符都归到 # 组
}

// 判断字符串是否以英文字母开头
function startsWithEnglishLetter(str: string): boolean {
  return /^[a-zA-Z]/.test(str);
}

// 排序
function sortItems<T extends Record<string, any>>(
  itemList: T[],
  getDisplayName: (item: T) => string,
): T[] {
  return [...itemList].sort((a, b) => {
    const nameA = getDisplayName(a);
    const nameB = getDisplayName(b);

    const firstCharA = getFirstChar(nameA);
    const firstCharB = getFirstChar(nameB);

    const priorityA = getSortPriority(firstCharA);
    const priorityB = getSortPriority(firstCharB);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // 同优先级内按字符排序
    if (firstCharA !== firstCharB) {
      return firstCharA.localeCompare(firstCharB);
    }

    // 首字符相同时，在同一个字母分组内，先英文字母后汉字
    const isEnglishA = startsWithEnglishLetter(nameA);
    const isEnglishB = startsWithEnglishLetter(nameB);

    if (isEnglishA !== isEnglishB) {
      return isEnglishA ? -1 : 1; // 英文字母排在前面
    }

    // 同类型（都是英文或都是汉字）时，按完整名称排序
    return nameA.localeCompare(nameB);
  });
}

// 分组排序
function groupItems<T extends Record<string, any>>(
  sortedList: T[],
  getDisplayName: (item: T) => string,
): { [key: string]: T[] } {
  const groupedList: { [key: string]: T[] } = {};

  sortedList.forEach((item) => {
    const name = getDisplayName(item);
    const firstChar = getFirstChar(name);
    const groupKey = getGroupKey(firstChar);

    if (!groupedList[groupKey]) {
      groupedList[groupKey] = [];
    }
    groupedList[groupKey].push(item);
  });

  // 对每个分组内部再次排序，确保英文字母在前，汉字在后
  Object.keys(groupedList).forEach((groupKey) => {
    groupedList[groupKey].sort((a, b) => {
      const nameA = getDisplayName(a);
      const nameB = getDisplayName(b);

      const isEnglishA = startsWithEnglishLetter(nameA);
      const isEnglishB = startsWithEnglishLetter(nameB);

      if (isEnglishA !== isEnglishB) {
        return isEnglishA ? -1 : 1;
      }

      // 同类型时按名称排序
      return nameA.localeCompare(nameB);
    });
  });

  return groupedList;
}

/**
 * 首字母排序
 * @param list 要排序的数据列表
 * @param getDisplayName 获取显示名称的函数
 * @param enableGroup 是否启用分组
 * @returns 排序后的结果
 */
export function sortByFirstChar<T extends Record<string, any>>(
  list: T[],
  getDisplayName: (item: T) => string,
  enableGroup: boolean = true,
): {
    sortedList: T[];
    groupedList: { [key: string]: T[] };
  } {
  const sortedList = sortItems(list, getDisplayName);
  let groupedList: { [key: string]: T[] } = {};
  if (enableGroup !== false) {
    groupedList = groupItems(sortedList, getDisplayName);
  }
  return {
    sortedList,
    groupedList,
  };
}
