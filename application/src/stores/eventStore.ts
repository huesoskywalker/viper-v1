import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface BearState {
    bears: number
    increase: (by: number) => void
}

const useBearStore = create<BearState>()(
    devtools(
        persist(
            (set) => ({
                bears: 0,
                increase: (by) => set((state) => ({ bears: state.bears + by })),
            }),
            {
                name: "bear-storage",
            }
        )
    )
)

type Store = {
    count: number
    inc: () => void
}

const useStore = create<Store>()((set) => ({
    count: 1,
    inc: () => set((state) => ({ count: state.count + 1 })),
}))

// function Counter() {
//   const { count, inc } = useStore()
//   return (
//     <div>
//       <span>{count}</span>
//       <button onClick={inc}>one up</button>
//     </div>
//   )
// }
