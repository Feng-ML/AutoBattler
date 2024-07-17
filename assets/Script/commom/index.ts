
import { Node, EventMouse, UITransform, Vec3, Vec2 } from "cc";


// 判断触摸事件是否在槽位里
export function withinTarget(targetNode: Node, touchEvent: EventMouse): boolean {
  const uiTransform = targetNode.getComponent(UITransform);
  const rect = uiTransform.getBoundingBox();  // 获取格子框

  const location = touchEvent.getUILocation();    // 触摸事件世界坐标
  const relativePoint = targetNode.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(location.x, location.y));     // 转相对坐标

  return rect.contains(new Vec2(relativePoint.x, relativePoint.y))
}