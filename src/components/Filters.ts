import { createElement } from "../lib/elements";
import {
  getDeselectedFilters,
  getFilters,
  setDeselectedFilters,
} from "../lib/nodes";

export default function Filters({ onChange }: { onChange: () => void }) {
  let deselectedFilters = getDeselectedFilters();
  const container = document.querySelector<HTMLElement>("#filters")!;
  const filters = getFilters();
  const items = filters.map((filter) => {
    const span = createElement("span", {
      innerText: filter.title,
      style: `--color: ${filter.color}`,
    });
    const checkbox = createElement("input", {
      type: "checkbox",
      name: filter.value,
      checked: !deselectedFilters.includes(filter.value),
      onchange: () => {
        if (checkbox.checked) {
          deselectedFilters = deselectedFilters.filter(
            (item) => item !== filter.value
          );
        } else {
          deselectedFilters.push(filter.value);
        }
        setDeselectedFilters(deselectedFilters);
        onChange();
      },
    });
    const label = createElement(
      "label",
      {
        className: "type-label",
        title: filter.title,
      },
      [checkbox, span]
    );
    return label;
  });
  container.innerHTML = "";
  container.append(...items);
}
