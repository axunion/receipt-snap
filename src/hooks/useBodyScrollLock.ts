import { type Accessor, createEffect, onCleanup } from "solid-js";

/**
 * ボディスクロールを制御するカスタムフック
 * モーダルやオーバーレイ表示時にバックグラウンドのスクロールを無効化する
 */
export function useBodyScrollLock(
	isActive: Accessor<boolean> | boolean,
	shouldLock: Accessor<boolean> | boolean = true,
) {
	let savedScrollY = 0;

	createEffect(() => {
		const active = typeof isActive === "function" ? isActive() : isActive;
		const lock = typeof shouldLock === "function" ? shouldLock() : shouldLock;

		if (active && lock) {
			// 現在のスクロール位置を保存
			savedScrollY = window.scrollY;

			// bodyのスクロールを無効化
			document.body.style.position = "fixed";
			document.body.style.top = `-${savedScrollY}px`;
			document.body.style.width = "100%";
			document.body.style.overflow = "hidden";
		} else if (!active && lock) {
			// スクロールロックが解除された時のクリーンアップ
			if (document.body.style.position === "fixed") {
				// bodyのスタイルをリセット
				document.body.style.position = "";
				document.body.style.top = "";
				document.body.style.width = "";
				document.body.style.overflow = "";

				// 元のスクロール位置に戻す
				window.scrollTo(0, savedScrollY);
			}
		}
	});

	onCleanup(() => {
		// コンポーネントがアンマウントされた時のクリーンアップ
		if (document.body.style.position === "fixed") {
			document.body.style.position = "";
			document.body.style.top = "";
			document.body.style.width = "";
			document.body.style.overflow = "";
			window.scrollTo(0, savedScrollY);
		}
	});
}
