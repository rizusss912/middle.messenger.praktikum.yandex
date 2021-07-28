import { AppAnimation } from "./animation";

export class Animator {
    private readonly target: Element;
    private readonly animations: AppAnimation[][];

    constructor(target: Element, animations: AppAnimation[][]) {
        this.target = target;
        this.animations = animations;
    }

    public animate(): Promise<void> {
        let endPromise: Promise<void> = Promise.resolve();

        for (let stepAnimations of this.animations) {
            endPromise = endPromise.then(() => this.animateStep(stepAnimations));
        }

        return endPromise;
    }

    private animateStep(animations: AppAnimation[]): Promise<void> {
        const endPromises = [];

        for (let animationConfig of animations) {
            const animation: Animation = this.target.animate(
                animationConfig.keyFrames,
                animationConfig.keyframeAnimationOptions,
            );

            endPromises.push(animation.finished);
        }

        return Promise.all(endPromises).then();
    }
}