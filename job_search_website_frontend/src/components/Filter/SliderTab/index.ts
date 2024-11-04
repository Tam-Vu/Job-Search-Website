const tabsBox = document.querySelector(".tabs-box"),
  allTabs = tabsBox?.querySelectorAll(".tab"),
  arrowIcons = document.querySelectorAll(".icon")

let isDragging = false

const handleIcons = (scrollVal: number) => {
  if (!tabsBox) return
  const maxScrollableWidth = tabsBox.scrollWidth - tabsBox.clientWidth
  const firstArrowParent = arrowIcons[0]?.parentElement
  const secondArrowParent = arrowIcons[1]?.parentElement

  if (firstArrowParent) {
    firstArrowParent.style.display = scrollVal <= 0 ? "none" : "flex"
  }
  if (secondArrowParent) {
    secondArrowParent.style.display = maxScrollableWidth - scrollVal <= 1 ? "none" : "flex"
  }
}

arrowIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    if (tabsBox) {
      // if clicked icon is left, reduce 350 from tabsBox scrollLeft else add
      tabsBox.scrollLeft += icon.id === "left" ? -340 : 340
      handleIcons(tabsBox.scrollLeft)
    }
  })
})

allTabs?.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabsBox?.querySelector(".active")?.classList.remove("active")
    tab.classList.add("active")
  })
})

const dragging = (e: MouseEvent) => {
  if (!isDragging) return
  tabsBox?.classList.add("dragging")
  if (tabsBox) {
    tabsBox.scrollLeft -= e.movementX
    handleIcons(tabsBox.scrollLeft)
  }
}

const dragStop = () => {
  isDragging = false
  tabsBox?.classList.remove("dragging")
}

if (tabsBox) {
  tabsBox.addEventListener("mousedown", () => (isDragging = true))
  tabsBox.addEventListener("mousemove", (e) => dragging(e as MouseEvent))
  document.addEventListener("mouseup", dragStop)
}
