export interface AppAnimation {
    keyFrames: Keyframe[],
    keyframeAnimationOptions: KeyframeAnimationOptions,
    onStart?: Array<(element: Element) => void>,
    onFinish?: Array<(element: Element) => void>,
}
