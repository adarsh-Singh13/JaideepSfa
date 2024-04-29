export const getConnectionStatus = (state) => {
	if (state.network && state.network.isConnected) {
		return true;
	}
	return false;
}