import type { JSX } from "solid-js";

interface MainLayoutProps {
	children: JSX.Element;
	title?: string;
}

export function MainLayout(props: MainLayoutProps) {
	return (
		<div class="min-h-screen bg-slate-50">
			<div class="max-w-md md:mx-auto bg-white p-6 border-x border-slate-200 shadow-md">
				{props.title && (
					<h1 class="mb-6 font-['Bonheur_Royale',cursive] text-3xl text-center text-sky-500">
						{props.title}
					</h1>
				)}
				{props.children}
			</div>
		</div>
	);
}
