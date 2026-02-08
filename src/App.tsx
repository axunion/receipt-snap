import { DevPanel } from "@/components/dev/DevPanel";
import { FormContainer } from "@/components/features/FormContainer";

function App() {
	return (
		<>
			<FormContainer />
			{import.meta.env.DEV && <DevPanel />}
		</>
	);
}

export default App;
