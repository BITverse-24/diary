import registerVerifyPassword from "../ipc/verifyPassword";

export default function registerAllIPCHandlers(): void {
	registerVerifyPassword();
	// Add future handlers here
}
