import { AppAnimation } from "../animation";

export class ShakingAnimation implements AppAnimation {
    keyFrames = [
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(1deg)' },
        { transform: 'rotate(-1deg)' },
        { transform: 'rotate(0deg)' },
    ];

    keyframeAnimationOptions = {
        duration: 70,
        iterations: 10
    };
}