import {AppAnimation} from '../app-animation';
import {transform} from '../animation-utils/transform.functions';

export class ShakingAnimation implements AppAnimation {
    public readonly keyFrames = [
    	{transform: transform.rotate(0)},
    	{transform: transform.rotate(1)},
    	{transform: transform.rotate(-1)},
    	{transform: transform.rotate(0)},
    ];

    public readonly keyframeAnimationOptions = {
    	duration: 70,
    	iterations: 10,
    };
}
