import {AppAnimation} from '../app-animation';

export function playAnimation(element: Element, animation: AppAnimation): Promise<void> {
	return new Promise<void>(resolve => {
		if (animation.onStart) {
			for (const onStartFunction of animation.onStart) {
				onStartFunction(element);
			}
		}

		resolve();
	})
		.then(() =>
			element.animate(animation.keyFrames, animation.keyframeAnimationOptions).finished,
		)
		.then(() => {
			if (animation.onFinish) {
				for (const onFinishFunction of animation.onFinish) {
					onFinishFunction(element);
				}
			}
		});
}
