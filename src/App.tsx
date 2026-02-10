import { DevPanel } from "@/components/dev/DevPanel";
import { FormContainer } from "@/components/features/FormContainer";
import { useParentMessage } from "@/hooks";

function App() {
	useParentMessage();

	return (
		<>
			<FormContainer />
			{import.meta.env.DEV && <DevPanel />}
		</>
	);
}

export default App;
