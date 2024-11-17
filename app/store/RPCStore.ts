import { create } from 'zustand';
import { persist } from 'zustand/middleware';
enum Cluster {
	mainnet = 'mainnet',
	devnet = 'devnet',
}
type RPCStore = {
	cluster: Cluster;
	ChangeCluster: () => void;
};

export const useRPCStore = create<RPCStore>()(
	persist(
		(set) => ({
			cluster: Cluster.devnet,
			ChangeCluster: () =>
				set((state) => ({
					cluster: state.cluster == Cluster.mainnet ? Cluster.devnet : Cluster.mainnet,
				})),
		}),
		{
			name: 'RPC',
		}
	)
);
