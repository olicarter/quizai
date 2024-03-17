import { Difficulty } from '@/types'

export function DifficultySection() {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-center font-extrabold leading-none text-2xl">
        Difficulty
      </h3>
      <div className="*:grow bg-white border-4 border-rose-500 flex h-16 rounded-full">
        <div>
          <input
            className="hidden peer"
            id="easy"
            name="difficulty"
            type="radio"
            value={Difficulty.Easy}
          />
          <label
            className="border-4 border-white cursor-pointer flex font-semibold grow h-14 items-center justify-center peer-checked:bg-rose-500 peer-checked:text-white rounded-full select-none text-xl"
            htmlFor="easy"
          >
            Easy
          </label>
        </div>
        <div>
          <input
            defaultChecked
            className="hidden peer"
            id="hard"
            name="difficulty"
            type="radio"
            value={Difficulty.Hard}
          />
          <label
            className="cursor-pointer peer-checked:bg-rose-500 border-4 border-white flex font-semibold grow h-14 items-center justify-center rounded-full peer-checked:text-white text-xl select-none"
            htmlFor="hard"
          >
            Hard
          </label>
        </div>
      </div>
    </section>
  )
}
