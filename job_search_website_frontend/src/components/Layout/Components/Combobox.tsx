import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { useState } from "react"

// interface peopleDTO{
//     id: number
//     name: string
// }

const people = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
]

export function ComboboxComp() {
  const [selectedPeople, setSelectedPeople] = useState([people[0], people[1]])
  const [query, setQuery] = useState("")

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox multiple value={selectedPeople} onChange={setSelectedPeople} onClose={() => setQuery("")}>
      {selectedPeople.length > 0 && (
        <ul>
          {selectedPeople.map((person) => (
            <li key={person.id}>
              <span className="text-black">{person.name}</span>
            </li>
          ))}
        </ul>
      )}
      <ComboboxInput aria-label="Assignees" onChange={(event) => setQuery(event.target.value)} />
      <ComboboxOptions anchor="bottom" className="border empty:invisible">
        {filteredPeople.map((person) => (
          <ComboboxOption key={person.id} value={person} className="data-[focus]:bg-blue-100">
            {person.name}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  )
}
