import { Icon } from "@iconify-icon/solid";
import type { JSX } from "solid-js";

interface LabelProps {
	children: JSX.Element;
	for?: string;
	required?: boolean;
	class?: string;
	icon?: string;
}

export function Label(props: LabelProps) {
	const baseClasses = "block text-sm font-semibold text-slate-700 mb-2";

	return (
		<label for={props.for} class={`${baseClasses} ${props.class ?? ""}`}>
			<div class="flex items-center gap-1">
				{props.icon && <Icon icon={props.icon} width="1.2em" height="1.2em" />}
				<span class="flex">
					{props.children}
					{props.required && (
						<Icon
							icon="material-symbols:asterisk-rounded"
							width="8"
							height="8"
							class="text-red-400 ml-1"
						/>
					)}
				</span>
			</div>
		</label>
	);
}
