import registerVerifyPassword from "../ipc/verifyPassword";
import registerInsertEntry from '../ipc/insertEntry';

export default function registerAllIPCHandlers(): void {
	registerVerifyPassword();
	registerInsertEntry();
}
