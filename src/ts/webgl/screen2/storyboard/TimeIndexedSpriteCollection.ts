import type { StorySprite } from "./Sprite2";

/**
 * 包装的精灵，记录原始索引用于保持顺序
 */
class IndexedStorySprite {
  public readonly sprite: StorySprite;
  public readonly originalIndex: number;

  constructor(sprite: StorySprite, originalIndex: number) {
    this.sprite = sprite;
    this.originalIndex = originalIndex;
  }
}

/**
 * 时间索引的精灵集合
 * 使用二分查找快速找到当前时间需要渲染的精灵，返回原始添加顺序
 */
export class TimeIndexedSpriteCollection {
  private sprites: StorySprite[] = [];
  private indexedSprites: IndexedStorySprite[] = [];
  private sortedByStartTime: IndexedStorySprite[] = [];
  private needsSorting = false;

  /**
   * 添加精灵到集合
   */
  public add(sprite: StorySprite): void {
    this.sprites.push(sprite);
    this.needsSorting = true;
  }

  /**
   * 移除精灵
   */
  public remove(sprite: StorySprite): void {
    const index = this.sprites.indexOf(sprite);
    if (index !== -1) {
      this.sprites.splice(index, 1);
      this.needsSorting = true;
    }
  }

  /**
   * 清空集合
   */
  public clear(): void {
    this.sprites = [];
    this.indexedSprites = [];
    this.sortedByStartTime = [];
    this.needsSorting = false;
  }

  /**
   * 获取所有精灵
   */
  public getAll(): StorySprite[] {
    return this.sprites;
  }

  /**
   * 获取当前时间需要渲染的精灵
   * 时间复杂度: O(k log k) 其中 k 是实际需要渲染的精灵数量
   * 使用时间索引快速找到符合条件的精灵，根据原始索引排序后返回
   */
  public getSpritesAtTime(currentTime: number): StorySprite[] {
    if (this.sprites.length === 0) {
      return [];
    }

    // 如果需要重新排序
    if (this.needsSorting) {
      this.sortSprites();
    }

    // 使用时间索引快速找到所有在当前时间活跃的精灵
    const activeIndexedSprites = this.findActiveIndexedSprites(currentTime);

    // 根据原始索引排序
    activeIndexedSprites.sort((a, b) => a.originalIndex - b.originalIndex);

    // 返回对应的精灵
    return activeIndexedSprites.map(indexedSprite => indexedSprite.sprite);
  }

  /**
   * 使用时间索引快速找到在当前时间活跃的精灵
   * 返回 IndexedStorySprite 数组，包含原始索引信息
   */
  private findActiveIndexedSprites(currentTime: number): IndexedStorySprite[] {
    const activeIndexedSprites: IndexedStorySprite[] = [];

    // 找到第一个开始时间 <= currentTime 的精灵位置
    const startIndex = this.findApproximateStartIndex(currentTime);

    // 从找到的位置开始向前和向后检查
    let firstValidIndex = startIndex;
    while (firstValidIndex > 0 && this.sortedByStartTime[firstValidIndex - 1].sprite.showTime <= currentTime) {
      firstValidIndex--;
    }

    // 从第一个有效位置开始，收集所有在当前时间活跃的精灵
    for (let i = firstValidIndex; i < this.sortedByStartTime.length; i++) {
      const indexedSprite = this.sortedByStartTime[i];
      const sprite = indexedSprite.sprite;

      // 如果精灵的开始时间已经超过当前时间，后面的都不需要检查了
      if (sprite.showTime > currentTime) {
        break;
      }

      // 检查精灵是否在当前时间活跃
      if (currentTime >= sprite.showTime && currentTime <= sprite.hideTime) {
        activeIndexedSprites.push(indexedSprite);
      }
    }

    return activeIndexedSprites;
  }

  /**
   * 使用二分查找找到大致的位置，然后通过线性搜索找到精确的第一个位置
   */
  private findApproximateStartIndex(currentTime: number): number {
    let left = 0;
    let right = this.sortedByStartTime.length - 1;
    let result = 0;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const indexedSprite = this.sortedByStartTime[mid];
      const sprite = indexedSprite.sprite;

      if (sprite.showTime <= currentTime) {
        result = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  }

  /**
   * 对精灵进行排序
   */
  private sortSprites(): void {
    // 创建索引精灵数组
    this.indexedSprites = this.sprites.map((sprite, index) => new IndexedStorySprite(sprite, index));

    // 按开始时间升序排序
    this.sortedByStartTime = [...this.indexedSprites].sort((a, b) => a.sprite.showTime - b.sprite.showTime);

    this.needsSorting = false;
  }

  /**
   * 获取集合大小
   */
  public get size(): number {
    return this.sprites.length;
  }

  /**
   * 检查是否需要重新排序
   */
  public get needsReindex(): boolean {
    return this.needsSorting;
  }
}
