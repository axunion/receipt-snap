import { useParentMessage } from "./model";
import { ExpenseFormScreen } from "./ui/ExpenseFormScreen";

export function ExpenseFormFeature() {
	useParentMessage();

	return <ExpenseFormScreen />;
}
