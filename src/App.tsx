import { DevPanel } from "@/components/dev/DevPanel";
import { ExpenseFormFeature } from "@/features/expense-form";

function App() {
	return (
		<>
			<ExpenseFormFeature />
			{import.meta.env.DEV && <DevPanel />}
		</>
	);
}

export default App;
