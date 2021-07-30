import { hideElement } from "../../functions/hide-element";
import { transform } from "../animation-utils/transform.functions";
import {AppAnimation} from "../app-animation";
import { VISIBILITY_CONFIG } from "../configs/visibility.config";

export class HideAnimation implements AppAnimation {
    public readonly keyFrames: Keyframe[] = [
        { opacity: 0, transform: transform.scale(1 - VISIBILITY_CONFIG.scaleChange)},
    ];

    public readonly keyframeAnimationOptions: KeyframeAnimationOptions = {
        duration: VISIBILITY_CONFIG.duration,
    };

    public readonly onFinish = [hideElement];
}